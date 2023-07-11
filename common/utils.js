const druidQueries = require('./druid_queries.json');
const { ResourceType, SolutionType } = require("./constants");
/**
  * Return druid query for the given query name
  * @function
  * @name getDruidQuery
  * @returns {Array}  returns druid query.  
*/

function getDruidQuery(name) {
  let query = {};

  if (druidQueries[name]) {
    query = JSON.parse(JSON.stringify(druidQueries[name]));
  }

  return query;
}

/**
  * Return druid connection string
  * @function
  * @name getDruidConnection
  * @returns {Array}  returns druid connection.  
*/

function getDruidConnection() {

  let options = {
    method: "",
    json: true,
    body: "",
    headers: {
      "Content-Type": "application/json"
    },
    url: process.env.DRUID_URL + "/druid/v2/?pretty"
  }

  return options;
}

/**
  * Return Gotenberg service connection string
  * @function
  * @name getGotenbergConnection
  * @returns {Array}  returns gotenberg server connection.  
*/

function getGotenbergConnection() {

  let options = {
    method: "POST",
    uri: process.env.GOTENBERG_URL + "/forms/chromium/convert/html",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    resolveWithFullResponse: true,
    encoding: null,
    json: true,
    formData: ""
  }

  return options;
}

/**
  * Return interval string for druid interval
  * @function
  * @name getDruidIntervalDate
  * @returns {String}  returns druid interval.  
*/

function getDruidIntervalDate( data ) {

  function padToTwoDigits( num ) {
    return num.toString().padStart(2, '0')
  }
  const [ date, month, year ] = data.split('-');
  const isoSring = `${year}-${padToTwoDigits(month)}-${padToTwoDigits(date)}T00:00:00+00:00`;
  return isoSring;
}

/**
  * Returns Druid Data source Name
  * @function
  * @name getDataSourceName
  * @returns {String}  returns druid data source name.  
*/
function getDataSourceName (query, body){
  let dataSource
  if(query.resourceType === ResourceType.PROGRAM){
    dataSource = process.env.PROGRAM_RESOURCE_DATASOURCE_NAME
  }else {
    switch (body.solutionType) {
      case SolutionType.PROJECT : dataSource = process.env.PROJECT_RESOURCE_DATASOURCE_NAME
        break;
      case SolutionType.OBSERVATION : dataSource = process.env.OBSERVATION_RESOURCE_DATASOURCE_NAME
        break;
      case SolutionType.SURVEY : dataSource = process.env.SURVEY_RESOURCE_DATASOURCE_NAME
        break;
    }
  }
  return dataSource
}

/**
  * Returns Druid Query Filter
  * @function
  * @name getResourceFilter
  * @returns {String}  returns druid query filter  
*/
function getResourceFilter (query) {
  const resourceFilter = {
    type: "selector",
    dimension: query.resourceType == ResourceType.SOLUTION ? "solution_id" : "program_id",
    value: query.resourceId
  }
  return resourceFilter
}

/**
  * Returns interval for druid query from previous Date to current Date
  * @function
  * @name getIntervalFilter
  * @returns {String}  returns interval filter "2023-05-11T00:00:00+00:00/2023-05-12T00:00:00+00:00"
*/
function getIntervalFilter () {
  const date = new Date();
  const currentDate = date.toISOString().split("T")[0];
  date.setDate(date.getDate() - 1);
  const previousDate = date.toISOString().split("T")[0];
  const interval = previousDate + "T00:00:00+00:00/" + currentDate + "T00:00:00+00:00";
  return interval;
}
/**
  * Returns Filtered data based on key passed
  * @function
  * @name filterForUniqueData
  * @param {Array} data - Array of objects
  * @param {String} key - object key based on which data is filtered
  * @returns {Array}  with unique element based on key passed  
  * sample of {data} param
  * [
      {
         "version":"v1",
         "timestamp":"2023-07-10T00:00:00.000Z",
         "event":{
            "district_name":"ANANTAPUR",
            "district_externalId":"2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03"
         }
      },
      {
         "version":"v1",
         "timestamp":"2023-07-10T00:00:00.000Z",
         "event":{
            "district_name":"Ananthapuram",
            "district_externalId":"2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03"
         }
      },
      {
         "version":"v1",
         "timestamp":"2023-07-10T00:00:00.000Z",
         "event":{
            "district_name":"CHITTOOR",
            "district_externalId":"b5c35cfc-6c1e-4266-94ef-a425c43c7f4e"
         }
      }
   ]
*/
function filterForUniqueData (data, key) {
  let result = Object.values(data.reduce((map, element) => {
    map[element[key]] = element;
    return map;
  }, {}));
  return result
}

module.exports = {
  getDruidQuery: getDruidQuery,
  getDruidConnection: getDruidConnection,
  getGotenbergConnection: getGotenbergConnection,
  getDruidIntervalDate: getDruidIntervalDate,
  getDataSourceName: getDataSourceName,
  getResourceFilter:getResourceFilter,
  getIntervalFilter:getIntervalFilter,
  filterForUniqueData:filterForUniqueData
}
