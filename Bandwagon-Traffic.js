/*
 * Surge information panel for the KiwiVM API.
 * The API credentials are supplied through the local module arguments.
 */

const API_ENDPOINT = "https://api.64clouds.com/v1/getServiceInfo";

function parseArguments(raw) {
  const result = {};

  String(raw || "")
    .split("&")
    .forEach((item) => {
      const separator = item.indexOf("=");
      if (separator < 0) return;

      const key = item.slice(0, separator).trim();
      const value = item.slice(separator + 1).trim();
      result[key] = value;
    });

  return result;
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes < 0) return "未知";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let amount = bytes;
  let unitIndex = 0;

  while (amount >= 1024 && unitIndex < units.length - 1) {
    amount /= 1024;
    unitIndex += 1;
  }

  const digits = amount >= 100 || unitIndex === 0 ? 0 : amount >= 10 ? 1 : 2;
  return `${amount.toFixed(digits)} ${units[unitIndex]}`;
}

function formatDate(value) {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "未知";

  const milliseconds = timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) return "未知";

  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values = {};
  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
}

function finishWithError(message) {
  $done({
    title: "搬瓦工 VPS",
    content: message,
    style: "error",
  });
}

const args = parseArguments(typeof $argument === "undefined" ? "" : $argument);
const veid = args.VEID;
const apiKey = args.API_KEY;

if (
  !veid ||
  !apiKey ||
  veid === "请填写VEID" ||
  apiKey === "请填写API_KEY"
) {
  finishWithError("请先在模组参数中填写 VEID 和 API Key");
} else {
  const url =
    `${API_ENDPOINT}?veid=${encodeURIComponent(veid)}` +
    `&api_key=${encodeURIComponent(apiKey)}`;

  $httpClient.get(
    {
      url,
      timeout: 8,
      "auto-cookie": false,
    },
    (error, response, body) => {
      if (error) {
        finishWithError(`查询失败：${error}`);
        return;
      }

      if (!response || response.status !== 200) {
        finishWithError(`KiwiVM API 返回 HTTP ${response?.status || "未知"}`);
        return;
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (_) {
        finishWithError("KiwiVM API 返回内容无法解析");
        return;
      }

      if (data.error || data.error_code) {
        finishWithError(`API 错误：${data.message || data.error || data.error_code}`);
        return;
      }

      const used = Number(data.data_counter);
      const total = Number(data.plan_monthly_data);

      if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0) {
        finishWithError("API 响应中缺少流量数据");
        return;
      }

      const remaining = Math.max(total - used, 0);
      const percentage = Math.min(Math.max((used / total) * 100, 0), 100);
      const status = data.ve_status || data.status || "未知";
      const isRunning = String(status).toLowerCase() === "running";
      const style = percentage >= 90 ? "error" : percentage >= 75 ? "alert" : "good";

      $done({
        title: `搬瓦工 VPS · ${percentage.toFixed(1)}%`,
        content: [
          `状态：${isRunning ? "运行中" : status}`,
          `已用：${formatBytes(used)}`,
          `剩余：${formatBytes(remaining)}`,
          `总量：${formatBytes(total)}`,
          `重置：${formatDate(data.data_next_reset)}（北京时间）`,
        ].join("\n"),
        style,
      });
    }
  );
}
