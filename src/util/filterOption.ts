export interface IFilterOption {
  text?: string;
  sortBy: string;
  sort: "ascending" | "descending";
}

export const filterOption: IFilterOption[] = [
  {
    text: "Theo tiêu thời gian đăng - mới",
    sortBy: "createAt",
    sort: "descending",
  },
  {
    text: "Theo tiêu thời gian đăng - cũ",
    sortBy: "createAt",
    sort: "ascending",
  },
  {
    text: "Theo tiêu đề A-Z",
    sortBy: "title",
    sort: "ascending",
  },
  {
    text: "Theo tiêu đề Z-A",
    sortBy: "title",
    sort: "descending",
  },
  {
    text: "Đã có đáp án",
    sortBy: "answer",
    sort: "descending",
  },
];
