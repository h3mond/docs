/* eslint-disable @typescript-eslint/no-floating-promises */
import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import {API} from "./api";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

/* Document scene */
const documentScene = new Scenes.BaseScene<Scenes.SceneContext>('document')
documentScene.enter(async (ctx) => {
  try {
    const documents = await API.getTemplates();
    const keyboard = documents.map(d => Markup.button.text(d.title));
    await ctx.reply('Choose certificate which you want to get', Markup.keyboard(keyboard).oneTime(true).resize(true))
  } catch (e) {
    console.error('Error', e.message)
  }
})

documentScene.on('message', async (ctx) => {
  try {
    const message = ctx.message;
    if (message === undefined) {
      ctx.scene.reset();
      return;
    }
    const text = String((message as any).text);
    const documents: any[] = await API.getTemplates();
    const docIndex = documents.findIndex(v => v.title.trim() === text.trim());
    if (docIndex !== -1) {
      await ctx.reply(`The certificate '${text}' was selected`, Markup.removeKeyboard())
      const id = parseInt(documents[docIndex]._id);
      await ctx.scene.leave();
      await ctx.scene.enter('email', { id })
    } else {
      await ctx.reply("I didn't quite understand what you are interested in, try to rephrase the question");
      await ctx.scene.reenter();
    }
  } catch (e) {
    console.error('Error', e.message)
  }
})

/* Email scene */
const emailScene = new Scenes.BaseScene<Scenes.SceneContext>('email');
emailScene.enter(async (ctx) => {
  await ctx.reply('Now you need to enter your student email to continue')
})

emailScene.on('message', async (ctx) => {
  try {
    const message = ctx.message;
    if (message === undefined) {
      ctx.scene.reset();
      return;
    }
    const email = (message as any).text;
    const student = await API.getUser(email)
    if (student !== null) {
      const id = parseInt((ctx.scene.state as any).id)
      await ctx.scene.leave();
      await ctx.scene.enter('download', Object.assign({}, { email, id }))
    } else {
      await ctx.reply('I could not found student with such email. Please type again', Markup.inlineKeyboard([
        Markup.button.callback('Back', 'back')
      ]))
    }
  } catch (e) {
    console.error('Error', e.message)
  }
})

emailScene.action('back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('document')
})


/* Download scene */
const downloadScene = new Scenes.BaseScene<Scenes.SceneContext>('download');
downloadScene.enter(async (ctx) => {
  try {
    const email = (ctx.scene.state as any).email;
    const id = (ctx.scene.state as any).id;
    await ctx.reply('Application has been created, please wait for a response');
    API.generateDocument(id, email).then((data: any) => {
      const generatedDocumentId = data.id
      ctx.reply('Your application has been processed. Here\'s the link to download', Markup.inlineKeyboard([
        // Markup.button.url('Download', 'http://localhost:3001/api/document/download?id=' + id)
        Markup.button.url('Download', 'http://google.com' + id)
      ]))
    }).catch((e) => {
      throw new Error('Could not send requset to generate document. Reason ' + e.message)
    })
    await ctx.scene.leave()
    await ctx.scene.enter('document');
  } catch (e) {
    console.error('Error', e.message);
  }
})


const bot = new Telegraf<Scenes.WizardContext>(token)
const stage = new Scenes.Stage<Scenes.SceneContext>([documentScene, emailScene, downloadScene], {
  ttl: 10,
})
bot.use(session())
bot.use(stage.middleware())
bot.use((ctx) => ctx.scene.enter('document'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
