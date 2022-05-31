/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const botConfig = 'label-config.yml'

module.exports = (app) => {
  app.log.info("Loaded!");

  app.on("issues.opened", async (context) => {
    const config = await context.config(botConfig);
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
    const config = await context.config(botConfig);
    if (context.isBot) return; // ignore the bots
    app.log.debug("New comment. Deciding which labels to apply...");

    let issueLabels = context.payload.issue.labels.map((label) => label.name);
    app.log.debug(`Current issue labels: ${issueLabels}`);

    let waitingOn;
    let toBeRemoved;
    let removeNew;
    if (context.payload.comment.author_association === "OWNER") {
      waitingOn = config.labels.waitingOnUser;
      toBeRemoved = config.labels.waitingOnYou;
      removeNew = true;
    } else {
      waitingOn = config.labels.waitingOnYou;
      toBeRemoved = config.labels.waitingOnUser;
    }

    // remove the old label if it exists
    if (issueLabels.includes(toBeRemoved)) {
      app.log.debug(`Found label to remove: ${toBeRemoved}`);
      delete issueLabels[issueLabels.indexOf(toBeRemoved)];
    }

    // make sure we remove the "new" label when it's
    // no longer needed.
    if (removeNew && issueLabels.includes(config.labels.new)) {
      app.log.debug("This issue isn't 'new' anymore...");
      delete issueLabels[issueLabels.indexOf(config.labels.new)];
    }

    // add the new label
    issueLabels.push(waitingOn);

    // clean the array
    app.log.debug(`before clean: ${issueLabels}`);
    issueLabels = issueLabels.filter((label) => {
      return label !== null;
    });
    app.log.debug(`after clean: ${issueLabels}`);

    // update issue labels
    return context.octokit.issues.setLabels(
      context.issue({ labels: issueLabels })
    );
  });
};
