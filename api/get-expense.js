export default async function handler(req, res) {
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ error: '找不到 Notion 金鑰' });
    }

    try {
        // 自動計算「這個月」的 1 號到月底
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

        // 去敲 Notion 的門
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
                            property: 'Type', // ⚠️ 你的「支出/收入」欄位名稱
                            select: {
                                equals: 'Expense' // ⚠️ 你標示支出的「標籤名稱」
                            }
                        },
                        {
                            property: 'Date', // ⚠️ 你的「日期」欄位名稱
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
            return res.status(response.status).json({ error: '無法讀取 Notion' });
        }

        const data = await response.json();

        // 算出總金額
        let totalAmount = 0;
        data.results.forEach(page => {
            const amount = page.properties.Amount?.number || 0; // ⚠️ 你的「金額」欄位名稱
            totalAmount += amount;
        });

        return res.status(200).json({ total: totalAmount });

    } catch (error) {
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}