export default async function handler(req, res) {
    const NOTION_API_KEY = process.env.notion_api_key;
    const ACCOUNT_DATABASE_ID = process.env.accounts_database_id; 

    if (!NOTION_API_KEY || !ACCOUNT_DATABASE_ID) {
        return res.status(500).json({ error: '找不到金鑰或資料庫ID' });
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${ACCOUNT_DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    select: {
                        equals: 'Spendable'
                    }
                }
            })
        });

        if (!response.ok) {
            return res.status(500).json({ error: '無法讀取帳戶資料' });
        }

        const data = await response.json();

        let totalBalance = 0;
        data.results.forEach(page => {
            // 🟢 修正：金額藏在 formula.number 裡面
            const balance = page.properties['Current Balance']?.formula?.number || 0;
            totalBalance += balance;
        });

        return res.status(200).json({ total: totalBalance });

    } catch (error) {
        console.error('後端錯誤:', error);
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}