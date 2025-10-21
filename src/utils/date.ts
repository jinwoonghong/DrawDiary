/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * Date 객체를 YYYY-MM-DD 형식 문자열로 변환
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식 문자열을 Date 객체로 변환
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayString = (): string => {
  return formatDate(new Date());
};

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

/**
 * 날짜를 표시용 문자열로 변환 (예: 2025년 10월 21일)
 */
export const formatDisplayDate = (dateString: string): string => {
  const date = parseDate(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 상대적 날짜 표시 (예: 오늘, 어제, 3일 전)
 */
export const getRelativeDate = (dateString: string): string => {
  const date = parseDate(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return formatDisplayDate(dateString);
  }
};
