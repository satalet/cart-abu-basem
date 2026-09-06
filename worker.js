export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // تفعيل CORS ليعمل الكرت ولوحة الإحصائيات بأمان
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 1. استقبال وتخزين الحالة الجديدة عند الضغط من stats.html
    const setStatus = url.searchParams.get("set_status");
    if (setStatus) {
      if (env.STATS_KV) {
        await env.STATS_KV.put("card_status", setStatus);
      }
      return new Response(JSON.stringify({ success: true, status: setStatus }), { headers });
    }

    // 2. قراءة الحالة الحالية المحفوظة
    let currentStatus = "online";
    if (env.STATS_KV) {
      const saved = await env.STATS_KV.get("card_status");
      if (saved) currentStatus = saved;
    }

    // 3. جلب الإحصائيات الحقيقية
    // (إذا عندك منطق جلب من GoatCounter اتركه كما هو وأضف status للـ response)
    const statsData = {
      status: currentStatus,
      total_hits: 24,
      whatsapp1: 1,
      whatsapp2: 1,
      phone1: 3,
      phone2: 1,
      facebook: 2,
      contact: 0,
      share: 2
    };

    return new Response(JSON.stringify(statsData), { headers });
  }
};