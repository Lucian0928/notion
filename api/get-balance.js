export default async function handler(req, res) {
    // 這裡使用了修正後的 accounts_database_id (全小寫，多了一個 s)
    const NOTION_API_KEY = process.env.notion_api_key;
    const ACCOUNT_DATABASE_ID = process.env.accounts_database_id; 

    if (!NOTION_API_KEY || !ACCOUNT_DATABASE_ID) {
        return res.status(500).json({ error: '找不到金鑰或資料庫ID，請確認 Vercel 環境變數設定是否正確' });
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
                    property: 'Status', // 你的標籤欄位
                    select: {
                        equals: 'Spendable' // 只抓可支配帳戶
                    }
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            return res.status(500).json({ error: '無法讀取帳戶資料', details: error });
        }

        const data = await response.json();

        let totalBalance = 0;
        data.results.forEach(page => {
            // 對齊你的金額欄位 'Current Balance'
            const balance = page.properties['Current Balance']?.number || 0;
            totalBalance += balance;
        });

        return res.status(200).json({ total: totalBalance });

    } catch (error) {
        console.error('後端錯誤:', error);
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}