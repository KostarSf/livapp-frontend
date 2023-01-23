export type DrainStatusType = {
  // Нагруженность
  load: string;
  // Вероятность засора
  clog: string;
};

export function drainStatus(
  value1: number,
  value2: number,
  max: number
): DrainStatusType | null {
  if (Number.isNaN(value1) || Number.isNaN(value2)) {
    return null;
  }

  let status: DrainStatusType = { load: "", clog: "" };
  const maxVal = max * 0.85;
  const medVal = max * 0.5;
  const lowVal = max * 0.1;

  if (value1 > maxVal || value2 > maxVal) {
    status.load = "Высокая";
  } else if (value1 > medVal || value2 > medVal) {
    status.load = "Средняя";
  } else if (value1 > lowVal || value2 > lowVal) {
    status.load = "Низкая";
  } else {
    status.load = "Отсутствует";
  }

  const [firstVal, secondVal] =
    value1 > value2 ? [value1, value2] : [value2, value1];
  const clogRatio = firstVal / secondVal;

  if (clogRatio > 5) {
    status.clog = "Максимальная";
  } else if (clogRatio > 3) {
    status.clog = "Большая";
  } else if (clogRatio > 2) {
    status.clog = "Средняя";
  } else if (clogRatio > 1.3) {
    status.clog = "Небольшая";
  } else {
    status.clog = "Отсутствует";
  }

  return status;
}

export function mapLink(x: string, y: string, zoom: number = 20) {
  return (
    `https://yandex.ru/maps/970/novorossiysk/` +
    `?ll=${y}%2C${x}` +
    `&mode=whatshere` +
    `&whatshere%5Bpoint%5D=${y}%2C${x}` +
    `&whatshere%5Bzoom%5D=${zoom}&z=${zoom}`
  );
}
