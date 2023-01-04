module.exports = async function(context, commands, env) {
  await commands.measure.start(`login-${env}`);

  try {
    await commands.navigate(
      `https://web.${env}.afcu.live.backbaseservices.com/retail-banking`
    );

    await commands.wait.byId('username', 50000);

    await commands.addText.byId('TestAMonroe', 'username');
    await commands.addText.byId('BB21@Amonroe', 'password-field');

    await commands.click.byIdAndWait('kc-login');

    const url = await commands.js.run('return window.location.href');

    if (url.includes("accounts-overview")) {
      await commands.wait.byCondition("!!document.querySelector('div.bb-accounts-overview-grid') === true", 20000)
    }
    
    return commands.measure.stop();
  } catch (e) {
    throw e;
  }
};
