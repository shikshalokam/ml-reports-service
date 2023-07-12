/**
 * name : constants.js
 * author : Ankit Shahu
 * created-date : 10-April-2023
 * Description : This is to keep all the hard code value in form of variable.
 */


/**
 * Description : projection passed by frontend
 */
exports.ResourceTypeProjection = {
    DISTRICT:"district",
    BLOCK:"block",
    ORGANISATION:"organisation"
    
}

/**
 * Description : resource type passed by frontend
 */
exports.ResourceType = {
    PROGRAM:"program",
    SOLUTION:"solution"
}

/**
 * Description : solution type passed by frontend
 */
exports.SolutionType = {
    PROJECT : "improvementProject",
    OBSERVATION: "observation",
    SURVEY :"survey"
}

/**
 * Description : druid query interval for raw data-source
 */
exports.druidQueryInterval = {
    RAW_DATA_SOURCE_INTERVAL : "1901-01-01T00:00+00:00/2101-01-01T00:00:00+00:00",
}