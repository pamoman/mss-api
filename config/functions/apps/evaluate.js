/* 
 * API - Evaluate Apps
 */

/* Update the dates when changing risk levels */
const handleRiskDates = async (level, dateConfirmed, data) => {
    const { helper } = strapi.config.functions.apps;

    switch (true) {
        case level === 0:
            data.date_confirmed = null;
            data.date_revised = null;
            break;
        case (level > 0 && dateConfirmed === null):
            data.date_confirmed = helper.formatMyDate(new Date());
            break;
        case (level > 0 && dateConfirmed != null):
            data.date_revised = helper.formatMyDate(new Date());
            break;
        default:
            break;
    }
};

const evaluateAppRisk = async (domain) => {
    const apps = await strapi.query("app").find({ _limit: -1 }, ["risk_assessments", "risk_assessments.risk_level"]);
    let count = 0;

    for (const app of apps) {
        const { id, title, dynamic_risk, risk_assessments, date_confirmed } = app;

        if (dynamic_risk) {
            strapi.log.info(`Evaluating risk level for ${domain} app: ${title}`);

            const riskLevel = await strapi.config.functions.apps.risk.updateAppRiskLevel(risk_assessments);
            const { level } = riskLevel || {};

            const data = { risk_level: riskLevel.id };

            handleRiskDates(level, date_confirmed, data);

            await strapi.query("app").update({ id }, data);

            count++;
        }
    }

    return { action: "App risk evaluation", count };
};

module.exports = {
    appData: async (params) => {
        const { domain, type } = params;
        const allowed = ["bos", "dlg"];

        if (allowed.includes(domain)) {
            switch (type) {
                case "risk":
                    strapi.log.info(`Risk evaluating ${domain} Apps...`);
    
                    return await evaluateAppRisk(domain);
            }
            
            
            return await evaluateAppRisk();
            
        } else {
            strapi.log.fatal("Invalid domain name.")
        }
    }
}