/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const helpers = require("./lib/label-helpers");
const botConfig = "label-config.yml";

module.exports = (app) => {
  app.log.info("Loaded!");

  app.on("issues.opened", async (context) => {
    const config = await context.config(botConfig);
    if (!config) {
      let info = context.repo();
      app.log.info(`Could not fetch config for ${info.owner}/${info.repo}`);
      return
    }
    app.log.debug("New issue!");

    const issueComment = context.issue({
      body: config.messages.welcome,
    });
    await context.octokit.issues.createComment(issueComment);

    const newLabels = context.issue({
      labels: [config.labels.new, config.labels.waitingOnYou],
    });
    return context.octokit.issues.addLabels(newLabels);
  });

  app.on("issue_comment.created", async (context) => {
    if (context.isBot) return; // ignore the bots
    const config = await context.config(botConfig);
    if (!config) {
      let info = context.repo();
      app.log.info(`Could not fetch config for ${info.owner}/${info.repo}`);
      return
    }
    app.log.debug("New comment. Deciding which labels to apply...");

    let issueLabels = context.payload.issue.labels.map((label) => label.name);
    app.log.debug(`Current issue labels: ${issueLabels}`);

    let newLabels = helpers.pickLabels(config, context, issueLabels);

    return context.octokit.issues.setLabels(
      context.issue({ labels: newLabels })
    );
  });
};
