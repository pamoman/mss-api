/* 
 * App risk handler
 */

/*
 * Calculate app risk
 */
const calculateRisk = async (risks) => {
    let res;

    if (!risks.length) {
        res = await strapi.query("risk-level").findOne({ default: true });
    } else {
        const maxRiskLevel = Math.max.apply(Math, risks.map((risk) => risk.level ));

        res = await strapi.query("risk-level").findOne({ level: maxRiskLevel });
    }
    
    return res;
};

const updateRiskLevel = async (riskAssessments = []) => {
    const riskAssessmentsRiskLevels = [];
    
    for (const riskAssessment of riskAssessments) {
        const { risk_level } = riskAssessment;

        riskAssessmentsRiskLevels.push(risk_level);
    };

    return await calculateRisk(riskAssessmentsRiskLevels); 
};

module.exports = {
    updateAppRiskLevel: async (riskAssessments) => {
        return await updateRiskLevel(riskAssessments);
    }
};
