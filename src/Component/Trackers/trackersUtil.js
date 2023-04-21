import { Typography } from "antd";

const { Text } = Typography;

export const contructTrackerItems = () => {
  let item = [];
  ["Company","Price Dropped", "Search", "Sort By"].forEach(
    (element, index) => {
      let obj = {};
      obj.key = index + "_" + element + "_filter_sidenav";
      obj.label = <Text>{element}</Text>;
      item.push(obj);
    }
  );
  return item;
};
