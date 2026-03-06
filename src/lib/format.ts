import dayjs from "dayjs";

export function formatDate(date: string | Date, format = "YYYY-MM-DD") {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date) {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("ko-KR").format(num);
}
