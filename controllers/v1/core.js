const pdfHandlerV2 = require('../../helper/common_handler_v2');


exports.statsReport = async function(req,res){
    
    let overview = req.body.data;
    try{
        let response = await pdfHandlerV2.coreStatsReportGeneration(overview);
        res.status(200).send(response);
    }catch(err){
        res.status(400).send({
          result: false,
          message: 'INTERNAL_SERVER_ERROR'
        })
    }

 }
 