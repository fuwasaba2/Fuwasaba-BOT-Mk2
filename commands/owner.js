const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let adminUserID = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('メッセージを埋め込みにして送信します。'),
	async execute(interaction) {
		const user = interaction.user;

		// インタラクションの応答を保留
		await interaction.deferReply({ ephemeral: true });

		if (adminUserID === user.id) {
			// 既に保存されている場合は削除
			adminUserID = null;
			await interaction.editReply({ content: 'ownerモードを解除しました。' });
		} else {
			// 新しく保存
			adminUserID = user.id;
			await interaction.editReply({ content: 'ownerモードになりました。' });
		}
	},
	getAdminUserID: () => adminUserID, // IDを取得するための関数をエクスポート
};
