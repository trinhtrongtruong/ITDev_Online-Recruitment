import React from 'react';
import { BackTop } from "antd";
import { orange } from "@ant-design/colors";
import '../../styles/footer.scss';
import { FacebookFilled, FacebookOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="grid wide footer__content">
                <div className="row">
                    <div className="col l-2-4 m-2 c-12 ">
                        <h3 className="footer__heading">Chăm sóc khách hàng</h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Trung tâm trợ giúp</a>
                            </li>
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">IT-Shop Mall</a>
                            </li>    
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Hướng dẫn ứng tuyển</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l-2-4 m-2 c-12">
                        <h3 className="footer__heading">Giới thiệu</h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Trung tâm trợ giúp</a>
                            </li>
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">IT-Shop Mall</a>
                            </li>    
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Hướng dẫn ứng tuyển</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l-2-4 m-2 c-12">
                        <h3 className="footer__heading">Nổi bật</h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Top công ty</a>
                            </li>
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Công việc mới nhất</a>
                            </li>    
                            <li className="footer-item">
                                <a href="https://itviec.com/vi" className="footer-item__link">Công việc tuyển nhiều</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l-2-4 m-2 c-12">
                        <h3 className="footer__heading">Theo dõi chúng tôi</h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__link-icon fa-brands fa-facebook"></i>
                                    <FacebookFilled style={{ fontSize: '16px', color: '#ffff', backgroundColor: '#3EA0F6', borderRadius: '1px' }} />&nbsp;&nbsp;Facebook
                                </a>
                            </li>   
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__link-icon fa-brands fa-instagram"></i>
                                    <InstagramOutlined style={{ fontSize: '16px', color: '#ffff', background: 'linear-gradient(to bottom left, #6228d7 0%, #ee2a7b 50%, #f9ce34 100%)', borderRadius: '5px', padding: '1px'}} />&nbsp;&nbsp; Instagram
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__link-icon fa-brands fa-linkedin"></i>
                                    <LinkedinOutlined style={{ fontSize: '16px', color: '#ffff',backgroundColor: '#3EA0F6', borderRadius: '2px' }} />&nbsp;&nbsp; Linked
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col l-2-4 m-2 c-12">
                        <h3 className="footer__heading">Cửa hàng ứng dụng</h3>
                        <ul className="footer__download">
                            <img src="/images/QR_Code.png" alt="Download QR" className="footer__download-qr" />
                            <div className="footer__download-apps">
                                <a href="" className="footer__download-apps__link">
                                    <img src="/images/googleplay.png" alt="Google play" className="footer__download-apps-img" />
                                </a>
                                <a href="" className="footer__download-apps__link">
                                    <img src="/images/appstore.png" alt="App store" className="footer__download-apps-img" />
                                </a>
                            </div>
                        </ul>
                    </div>
                   
                </div>
            </div>
            <div className="footer__bottom ">
                <div className="grid wide">    
                    <p className="footer__text">Copyright © IT VIEC JSC &nbsp; | &nbsp; MST: 0312192258</p>             
                </div>
            </div>
        </footer>
    )
}

export default Footer;