export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ترويسات منع الكاش كلياً والسماح بالاتصال
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 1. استقبال وتخزين الحالة عند الضغط من لوحة stats.html
    const setStatus = url.searchParams.get("set_status");
    if (setStatus) {
      if (env.STATS_KV) {
        await env.STATS_KV.put("card_status", setStatus);
      }
      return new Response(JSON.stringify({ success: true, status: setStatus }), { headers });
    }

    // 2. قراءة الحالة المحفوظة
    let currentStatus = "online";
    if (env.STATS_KV) {
      const saved = await env.STATS_KV.get("card_status");
      if (saved) currentStatus = saved;
    }

    // 3. إرسال البيانات المباشرة
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