module.exports = async function(context, commands, env) {
  // Start a test labeled based on environment
  await commands.measure.start(`init`);

  try {
    // Navigate to the appriopriate retail site
    await commands.navigate(
      `https://web.${env}.afcu.live.backbaseservices.com/retail-banking`
    );

    await commands.measure.stop();
    await commands.measure.start(`login-${env}`);

    // Wait for identity to load and for the username field to become accessible
    await commands.wait.byCondition("!!document.querySelector('input#username') === true", 50000)

    // Enter login information
    await commands.addText.byId('Opportunity2', 'username');
    await commands.addText.byId('BB21@Opportunity', 'password-field');

    // Click login button
    await commands.click.byIdAndWait('kc-login');

    // Grab current url
    // const url = await commands.js.run('return window.location.href');

    // If login was successful, wait to stop measure until accounts are loaded.
    // if (url.includes("accounts-overview")) {
    //   await commands.wait.byCondition("!!document.querySelector('div.bb-accounts-overview-grid') === true", 20000)
    // }
    
    // Stop the login measure
    return commands.measure.stop();
  } catch (e) {
    throw e;
  }
};
