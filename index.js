/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const config = require("./config.json");

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: config.messages.welcome,
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issues.opened", async (context) => {
    const newLabels = context.issue({labels:[config.labels.new]});
    return context.octokit.issues.addLabels(newLabels);
  });

  app.on("issue_comment.created", async (context) => {
    if (context.isBot) return;
    const ourComment = context.issue({
      body: config.messages.onComment,
    });
    return context.octokit.issues.createComment(ourComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
