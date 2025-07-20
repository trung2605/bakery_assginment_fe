import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import breadcrumbBanner from "../../assets/images/breadcrumb.jpg";

import "./SystemPage.css";
import branchService from "../../services/brachService";

const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.827042986064!2d105.8164202750739!3d21.040954487595065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4386ba4841%3A0x2f7b7c41f25e1d8!2zUGjDoW4gbcOibSBxdWFuIMSR4buZIGjhu41jIHZpIMOhbiBo4bqhbmcgLSBTYXBvIFBPUw!5e0!3m2!1svi!2s!4v1684155369862!5m2!1svi!2s";

const SystemPage = () => {
  const [branches, setBranches] = useState([]);
  const [selectedMapUrl, setSelectedMapUrl] = useState(DEFAULT_MAP_URL);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchService.getAllBranches();
        setBranches(data);
        if (data.length > 0 && data[0].mapUrl) {
          setSelectedMapUrl(data[0].mapUrl);
          setSelectedBranchId(data[0].id);
        }
      } catch (err) {
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchClick = (branch) => {
    setSelectedMapUrl(branch.mapUrl || DEFAULT_MAP_URL);
    setSelectedBranchId(branch.id);
  };

  return (
    <div className="system-page">
      {/* Banner + Breadcrumb + Tiêu đề */}
      <section className="system-page-hero">
        <div className="system-hero-bg">
          <img src={breadcrumbBanner} alt="Hệ thống cửa hàng Dola" />
          <div className="system-hero-overlay"></div>
        </div>
        <div className="container text-center system-hero-content">
          <h1>Hệ thống cửa hàng</h1>
          <p>
            <Link to="/" className="breadcrumb-link">
              Trang chủ
            </Link>
            {" > "}
            <span className="breadcrumb-current">Hệ thống cửa hàng</span>
          </p>
        </div>
      </section>

      {/* Infobar vàng */}
      <div className="container">
        <div className="system-infobar">
          <div className="info-item">
            <i className="fas fa-store"></i>
            <div>
              <b>Hệ thống 6 cửa hàng</b>
              <br />
              Trên toàn quốc
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-users"></i>
            <div>
              <b>Hơn 100 nhân viên</b>
              <br />
              Để phục vụ quý khách
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <div>
              <b>Mở cửa 8-22h</b>
              <br />
              cả CN & Lễ tết
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="system-main">
          {/* Danh sách chi nhánh */}
          <div className="system-store-list">
            <div className="store-list">
              {branches.map((branch) => (
                <div
                  className={`store-card ${
                    selectedBranchId === branch.id ? "active" : ""
                  }`}
                  key={branch.id}
                  onClick={() => handleBranchClick(branch)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="store-name">{branch.name}</div>
                  <div className="store-address">
                    <b>Địa chỉ:</b> {branch.address}
                  </div>
                  <div className="store-hotline">
                    <b>Hotline:</b> {branch.hotline}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Map động */}
          <div className="system-map">
            <iframe
              title="map"
              src={selectedMapUrl}
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: "16px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
