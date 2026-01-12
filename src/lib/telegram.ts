export async function sendTelegramMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
        console.warn("Telegram configuration missing. Skipping notification.")
        return
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        })

        if (!response.ok) {
            console.error('Failed to send Telegram message:', await response.text())
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error)
    }
}
