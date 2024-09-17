const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let admin2UserID = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('メッセージを埋め込みにして送信します。'),
	async execute(interaction) {
		const user = interaction.user;

		// インタラクションの応答を保留
		await interaction.deferReply({ ephemeral: true });

		if (admin2UserID === user.id) {
			// 既に保存されている場合は削除
			admin2UserID = null;
			await interaction.editReply({ content: 'adminモードを解除しました。' });
		} else {
			// 新しく保存
			admin2UserID = user.id;
			await interaction.editReply({ content: 'adminモードになりました。' });
		}
	},
	getAdmin2UserID: () => admin2UserID, // IDを取得するための関数をエクスポート
};
