module.exports = async function(context, commands) {
  await commands.navigate(
    'https://web.dev.afcu.live.backbaseservices.com/retail-banking'
  );

  await commands.measure.start('login');

  try {
    await commands.addText.byId('TestOJohnson', 'username');
    await commands.addText.byId('BB21@Ojohnson', 'password-field');

    await commands.click.byIdAndWait('kc-login');

    return commands.measure.stop();
  } catch (e) {
    throw e;
  }
};
