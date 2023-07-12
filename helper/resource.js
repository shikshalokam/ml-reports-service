/**
 * name : resource.js
 * author : Ankit Shahu
 * created-date : 10-April-2023
 * Description : Resource level data for program and solution.
 */


 const { ResourceType } = require("../common/constants");
const rp = require('request-promise');
const kendra_service = require("./kendra_service");
const utils = require("../common/utils");

//user-extension validation: this will check if user is program manager or program designer of particular porgram.
exports.userExtensions = async function (req,res){
    return new Promise(async function (resolve, reject) {
        try {
            let userExtensions = await kendra_service.getUserExtension(req.userDetails.token)
            if(userExtensions.status === 200){
                for(let platformCode = 0; platformCode < userExtensions.result.platformRoles.length; platformCode++){
                    if((userExtensions.result.platformRoles[platformCode].code === "PROGRAM_DESIGNER" || userExtensions.result.platformRoles[platformCode].code === "PROGRAM_MANAGER") && (userExtensions.result.platformRoles[platformCode].programs.includes(req.body.programId))){
                        resolve(true)
                        break;
                    }
                }
                resolve(false);
            }else{
                resolve(false);
            }
        }catch(error){
            res.status(400).send({
                result: false,
                message: err.message
            });
        }
    })
}

//this function will call druid and return all the districts to particular program or solution
exports.getDistricts = async function(req,res){
    return new Promise(async function (resolve, reject) {
        try {
            let bodyParam = req.query.resourceType === ResourceType.SOLUTION ? gen.utils.getDruidQuery("solution_distric_level_query") : gen.utils.getDruidQuery("program_distric_level_query");
            //Gets data source name based on resource type and solution type
            bodyParam.dataSource = await utils.getDataSourceName(req.query, req.body)
            //Gets Resource filter based on Resource type
            const resourceFilter = await utils.getResourceFilter(req.query)
            bodyParam.filter.fields.push(resourceFilter)
            //Gets Interval filter from previous Date to current Date "2023-05-11T00:00:00+00:00/2023-05-12T00:00:00+00:00"
            //If a raw data source is passed the interval will be "1901-01-01T00:00+00:00/2101-01-01T00:00:00+00:00"
            bodyParam.intervals = await utils.getIntervalFilter(bodyParam.dataSource)
            let options = gen.utils.getDruidConnection();
            options.method = "POST";
            options.body = bodyParam;
            console.log(JSON.stringify(bodyParam))
            let data = await rp(options);
            if(data){
                let result = data.map(district => ({ id: district.event["district_externalId"] , name: district.event.district_name }));
                // send district with unique id. If more than one district have same id will send the last one in the list
                result  = await utils.filterForUniqueData(result,"id")
                resolve(result)
            }
        }catch(err){
            res.status(400).send({
                result: false,
                message: err.message
            });
        }
    })
}

//this function will call druid and return all the organisations to particular program or solution
exports.getOrganisations = async function(req,res){
    return new Promise(async function (resolve, reject) {
        try {
            let bodyParam = req.query.resourceType === ResourceType.SOLUTION ? gen.utils.getDruidQuery("solution_organisations_level_query") : gen.utils.getDruidQuery("program_organisations_level_query");
            //Gets data source name based on resource type and solution type
            bodyParam.dataSource = await utils.getDataSourceName(req.query, req.body)
            //Gets Resource filter based on Resource type
            const resourceFilter = await utils.getResourceFilter(req.query)
            bodyParam.filter.fields.push(resourceFilter)
            //Gets Interval filter from previous Date to current Date "2023-05-11T00:00:00+00:00/2023-05-12T00:00:00+00:00"
            //If a raw data source is passed the interval will be "1901-01-01T00:00+00:00/2101-01-01T00:00:00+00:00"
            bodyParam.intervals = await utils.getIntervalFilter(bodyParam.dataSource)
            let options = gen.utils.getDruidConnection();
            options.method = "POST";
            options.body = bodyParam;
            let data = await rp(options);
            if(data){
                let result = data.map(organisation => ({ id: organisation.event.organisation_id, name: organisation.event.organisation_name }));
                // send organisation with unique id. If more than one organisation have same id will send the last one in the list
                result  = await utils.filterForUniqueData(result,"id")
                resolve(result)
            }
        }catch(err){
            res.status(400).send({
                result: false,
                message: err.message
            });
        }
    })

}

//this function will call druid and return all the block to particular program or solution
exports.getBlocks = async function(req,res){
    return new Promise(async function (resolve, reject) {
        try {
            let bodyParam = req.query.resourceType === ResourceType.SOLUTION ? gen.utils.getDruidQuery("solution_block_level_query") : gen.utils.getDruidQuery("program_block_level_query");
            //Gets data source name based on resource type and solution type
            bodyParam.dataSource = await utils.getDataSourceName(req.query, req.body)
            //Gets Resource filter based on Resource type
            const resourceFilter = await utils.getResourceFilter(req.query)
            bodyParam.filter.fields.push(resourceFilter)
            //Gets Interval filter from previous Date to current Date "2023-05-11T00:00:00+00:00/2023-05-12T00:00:00+00:00" (for aggregate datasource)
            //If a raw data source is passed the interval will be "1901-01-01T00:00+00:00/2101-01-01T00:00:00+00:00"
            bodyParam.intervals = await utils.getIntervalFilter(bodyParam.dataSource)
            const districtFilter = {
                type: "selector",
                dimension: "district_externalId",
                value: req.body.query.districtLocationId
            }
            bodyParam.filter.fields.push(districtFilter)
            let options = gen.utils.getDruidConnection();
            options.method = "POST";
            options.body = bodyParam;
            let data = await rp(options);
            if(data){
                let result = data.map(block => ({ id: block.event["block_externalId"] , name: block.event.block_name }));
                // send blocks with unique id. If more than one block have same id will send the last one in the list
                result  = await utils.filterForUniqueData(result,"id")
                resolve(result)
            }
        }catch(err){
            res.status(400).send({
                result: false,
                message: err.message
            });
        }
        
    })

}
