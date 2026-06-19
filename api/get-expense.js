export default async function handler(req, res) {
    const NOTION_API_KEY = process.env.notion_api_key;
    const NOTION_DATABASE_ID = process.env.transactions_database_id;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ error: '找不到 Notion 金鑰' });
    }

    try {
        const now = new Date();
        
        // 計算本月時間範圍
        const firstDayThis = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDayThis = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        
        // 計算上個月時間範圍
        const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

        // 建立查詢 Notion 的通用函數
        const fetchNotionData = async (startDate, endDate) => {
            return fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: {
                        and: [
                            { property: 'Type(類型)', select: { equals: 'Expense' } },
                            { property: 'Date', date: { on_or_after: startDate } },
                            { property: 'Date', date: { on_or_before: endDate } }
                        ]
                    }
                })
            });
        };

        // 同時派發兩個任務去抓本月和上月資料
        const [resThisMonth, resLastMonth] = await Promise.all([
            fetchNotionData(firstDayThis, lastDayThis),
            fetchNotionData(firstDayLast, lastDayLast)
        ]);

        if (!resThisMonth.ok || !resLastMonth.ok) {
            return res.status(500).json({ error: '無法讀取 Notion 資料庫' });
        }

        const dataThisMonth = await resThisMonth.json();
        const dataLastMonth = await resLastMonth.json();

        // 加總金額
        let totalThis = 0;
        let totalLast = 0;
        dataThisMonth.results.forEach(page => totalThis += (page.properties.Amount?.number || 0));
        dataLastMonth.results.forEach(page => totalLast += (page.properties.Amount?.number || 0));

        // 計算 MoM (月環比)
        let mom = 0;
        if (totalLast === 0) {
            mom = totalThis > 0 ? 100 : 0; // 防呆：避免除以 0
        } else {
            mom = ((totalThis - totalLast) / totalLast) * 100;
        }

        // 把結果打包送給前端
        return res.status(200).json({ 
            total: totalThis, 
            lastTotal: totalLast, 
            mom: mom 
        });

    } catch (error) {
        console.error('後端程式發生錯誤:', error);
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}