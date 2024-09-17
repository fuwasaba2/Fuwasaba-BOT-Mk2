const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('認証パネルを設置します。'),
	async execute(interaction) {
		// 認証ボタンを作成
		const auth = new ButtonBuilder()
			.setCustomId('auth-button') // ボタンのカスタムID
			.setLabel('認証')
			.setStyle(ButtonStyle.Success);

		// ボタンを含むアクション行を作成
		const row = new ActionRowBuilder().addComponents(auth);

		// 認証パネルの埋め込みメッセージを作成
		const embed = new EmbedBuilder()
			.setTitle('認証パネル')
			.setDescription('下のボタンを押して認証を開始してください。');

		// メッセージとして送信
		await interaction.reply({
			embeds: [embed],
			components: [row],
		});
	},
};
