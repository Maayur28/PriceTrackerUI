import React from "react";
import { Layout, Menu, Image } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./nav.css";
import { handleLoginLogout } from "../../Util";
const { Header } = Layout;

const Nav = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ height: "60px", position: "relative" }}>
      <Header
        style={{
          width: "100%",
          padding: "0",
        }}
      >
        <Menu mode="horizontal">
          <Menu.Item key="logo" onClick={() => navigate("/")}>
            <Image
              width={80}
              height={50}
              src="/pricetracker-high-resolution-logo-color-on-transparent-background.png"
              preview={false}
            />
          </Menu.Item>
          <Menu.SubMenu
            key="profile"
            title={`Hello,
                ${
                  Cookies.get("accessToken") &&
                  Cookies.get("accessToken").endsWith("=") &&
                  Cookies.get("refreshToken") &&
                  Cookies.get("profileName")
                    ? Cookies.get("profileName")
                    : "sign in"
                }`}
            style={{
              position: "absolute",
              right: "1px",
              marginTop: "-5px",
            }}
          >
            <Menu.Item key="account" onClick={() => navigate("/account")}>
              My Account
            </Menu.Item>
            <Menu.Item key="trackers" onClick={() => navigate("/trackers")}>
              My Trackers
            </Menu.Item>
            <Menu.Item key="contact" onClick={() => navigate("/contact")}>
              Contact Us
            </Menu.Item>
            <Menu.Item
              key="login/logout"
              onClick={() =>
                handleLoginLogout() ? navigate("/") : navigate("/login")
              }
            >
              {Cookies.get("accessToken") &&
              Cookies.get("accessToken").endsWith("=") &&
              Cookies.get("refreshToken")
                ? "Logout"
                : "Login"}
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
    </Layout>
  );
};

export default Nav;
