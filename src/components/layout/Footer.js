import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light p-3">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-3">
            <h5 className="text-light">Company Bio</h5>
            <p className="grey-text text-lighten-4">
              We are a team of college students working on this project like
              it's our full time job. Any amount would help support and continue
              development on this project and is greatly appreciated.
            </p>
          </div>
          <div className="col-sm-12 col-md-3">
            <h5 className="text-light">Settings</h5>
            <ul>
              <li>
                <a className="text-light" href="#!">
                  Link 1
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 2
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 3
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 4
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-12 col-md-3">
            <h5 className="text-light">Connect</h5>
            <ul>
              <li>
                <a className="text-light" href="#!">
                  Link 1
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 2
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 3
                </a>
              </li>
              <li>
                <a className="text-light" href="#!">
                  Link 4
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          Made by{" "}
          <a
            className="brown-text text-lighten-3"
            href="http://materializecss.com"
          >
            Materialize
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
