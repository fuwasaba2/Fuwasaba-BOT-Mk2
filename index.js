const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { LISTENER } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

// commandsフォルダから、.jsで終わるファイルのみを取得
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`);
	}
}

// コマンドが送られてきた際の処理
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`${interaction.commandName} というコマンドは存在しません。`);
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'コマンドを実行中にエラーが発生しました。', ephemeral: true });
		}
	}

	if (interaction.isButton()) {
		if (interaction.customId === 'auth-button') {
			const modal = new ModalBuilder()
				.setCustomId('auth-modal')
				.setTitle('認証フォーム');

			const usernameInput = new TextInputBuilder()
				.setCustomId('username')
				.setLabel('ユーザー名を入力してください')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const row = new ActionRowBuilder().addComponents(usernameInput);

			modal.addComponents(row);

			await interaction.showModal(modal);
		}
	}

	if (interaction.isModalSubmit()) {
		if (interaction.customId === 'auth-modal') {
			const username = interaction.fields.getTextInputValue('username');

			await interaction.reply(`認証完了: ユーザー名は ${username} です。`);
		}
	}
});

// メッセージが送信されたときの処理
client.on('messageCreate', async message => {
	if (message.author.bot) return;

	const ownerCommand = require('./commands/owner');
	const adminUserID = ownerCommand.getAdminUserID();

	if (message.author.id === adminUserID) {
		const embed = new EmbedBuilder()
			.setColor(0xe91e62)
			.setAuthor({ name: message.author.displayName, iconURL: message.author.displayAvatarURL() })
			.setDescription(message.content);

		await message.channel.send({ embeds: [embed] });
		await message.delete();
	}

	const adminCommand = require('./commands/admin');
	const admin2UserID = adminCommand.getAdmin2UserID();

	if (message.author.id === admin2UserID) {
		const embed = new EmbedBuilder()
			.setColor(0x9b59b6)
			.setAuthor({ name: message.author.displayName, iconURL: message.author.displayAvatarURL() })
			.setDescription(message.content);

		await message.channel.send({ embeds: [embed] });
		await message.delete();
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(LISTENER.TOKEN);
