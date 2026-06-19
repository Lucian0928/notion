export default async function handler(req, res) {
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ error: '找不到 Notion 金鑰，請檢查 Vercel 環境變數。' });
    }

    try {
        // 自動計算「這個月」的 1 號到月底
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

        // 帶上鑰匙，去敲 Notion 的門
        const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    and: [
                        {
                            property: 'Type(類型)', // 🟢 完美對齊你的專屬欄位名稱
                            select: {
                                equals: 'Expense' // 🟢 對齊你的支出標籤
                            }
                        },
                        {
                            property: 'Date', // 🟢 對齊日期
                            date: {
                                on_or_after: firstDay
                            }
                        },
                        {
                            property: 'Date',
                            date: {
                                on_or_before: lastDay
                            }
                        }
                    ]
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API 拒絕訪問:', errorText);
            return res.status(response.status).json({ error: '無法讀取 Notion 資料庫', details: errorText });
        }

        const data = await response.json();

        // 把抓回來的資料，用 for 迴圈算出總金額
        let totalAmount = 0;
        data.results.forEach(page => {
            // 🟢 對齊金額欄位 'Amount'
            const amount = page.properties.Amount?.number || 0;
            totalAmount += amount;
        });

        // 成功！把算好的總金額丟出去
        return res.status(200).json({ total: totalAmount });

    } catch (error) {
        console.error('後端程式發生錯誤:', error);
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}