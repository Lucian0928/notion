export default async function handler(req, res) {
    const NOTION_API_KEY = process.env.notion_api_key;
    const NOTION_DATABASE_ID = process.env.transactions_database_id;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ error: '找不到 Notion 金鑰' });
    }

    try {
        const now = new Date();
        // 本月範圍
        const firstDayThis = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDayThis = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        // 上月範圍
        const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

        const fetchNotion = async (start, end) => {
            const resp = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: {
                        and: [
                            { property: 'Type', select: { equals: 'Expense' } },
                            { property: 'Date', date: { on_or_after: start } },
                            { property: 'Date', date: { on_or_before: end } }
                        ]
                    }
                })
            });
            return await resp.json();
        };

        const [dataThis, dataLast] = await Promise.all([
            fetchNotion(firstDayThis, lastDayThis),
            fetchNotion(firstDayLast, lastDayLast)
        ]);

        let totalThis = 0;
        let totalLast = 0;
        dataThis.results.forEach(p => totalThis += (p.properties.Amount?.number || 0));
        dataLast.results.forEach(p => totalLast += (p.properties.Amount?.number || 0));

        let mom = 0;
        if (totalLast !== 0) {
            mom = ((totalThis - totalLast) / totalLast) * 100;
        } else if (totalThis > 0) {
            mom = 100;
        }

        return res.status(200).json({ total: totalThis, mom: mom });
    } catch (error) {
        return res.status(500).json({ error: '伺服器內部錯誤' });
    }
}