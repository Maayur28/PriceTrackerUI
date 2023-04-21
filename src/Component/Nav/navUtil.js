import { Avatar, Divider, Button, Empty, Typography } from "antd";
import Cookies from "js-cookie";

const { Title, Text } = Typography;

const dismissNotification = async ({ setItems }) => {
  if (
    Cookies.get("accessToken") !== undefined &&
    Cookies.get("refreshToken") !== undefined
  ) {
    fetch("https://price-tracker-auth.vercel.app/dismissNotification", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        if (data.success === true) {
          contructItems([]);
          localStorage.removeItem("priceTracker_notification");
        }
      })
      .catch((err) => {
        console.log("Not logged In!!");
      });
  }
};

export const contructItems = ({ notifyData, setItems }) => {
  let item = [];
  if (notifyData != null && notifyData !== undefined && notifyData.length > 0) {
    let obj = {};
    obj.key = "header_notify";
    obj.label = (
      <>
        <div style={{ cursor: "default" }}>
          <Button
            onClick={() => dismissNotification({ setItems })}
            type="text"
            style={{ position: "absolute", right: "0", top: "0" }}
          >
            Dismiss
          </Button>
        </div>
        <Divider
          style={{ margin: "0", marginTop: "30px", marginBottom: "2px" }}
        />
      </>
    );
    item.push(obj);
    notifyData.forEach((element) => {
      let difference_ms = Date.now() - element.date;
      //take out milliseconds
      difference_ms = difference_ms / 1000;
      let seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms / 60;
      let minutes = Math.floor(difference_ms % 60);
      difference_ms = difference_ms / 60;
      let hours = Math.floor(difference_ms % 24);
      let days = Math.floor(difference_ms / 24);
      let obj = {};
      obj.key = element._id;
      obj.label = (
        <div
          style={{ display: "flex" }}
          onClick={() => openInNewTab(element.url)}
        >
          <Avatar
            shape="square"
            size={56}
            src={<img width="60px" src={element.image} alt="avatar" />}
          />
          <div style={{ marginLeft: "10px" }}>
            <Title style={{ margin: "0" }} level={5}>
              Price dropped by{" "}
              <span style={{ color: "#7f4574", fontWeight: "bolder" }}>
                ₹{element.price}
              </span>
            </Title>
            <Text ellipsis={true} style={{ maxWidth: "250px" }}>
              {element.title}
            </Text>
            <div>
              <Text type="secondary">
                {days === 0
                  ? hours === 0
                    ? minutes === 0
                      ? `${seconds} seconds ago`
                      : `${minutes} minutes ago`
                    : `${hours} hours ago`
                  : `${days} days ago`}
              </Text>
            </div>
          </div>
        </div>
      );
      item.push(obj);
    });
  } else {
    let obj = {};
    obj.key = "no_notification";
    obj.label = <Empty />;
    item.push(obj);
    localStorage.removeItem("priceTracker_notification");
  }
  setItems(item);
};

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
