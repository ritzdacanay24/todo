/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import './styles.css';
import searchRecipeVideo from '../../videos/searchForRecipes.mp4';
import randomRecipes from '../../videos/randomRecipes.mp4';
import realTimeUpdates from '../../videos/realTimeUpdates.mp4';
import { Link } from 'react-router-dom';

export default function HomePage(props) {

  const groceryStores = [
    "https://developer.kroger.com/assets/logos/bakers.svg",
    "https://developer.kroger.com/assets/logos/frys.svg",
    "https://developer.kroger.com/assets/logos/dillons.svg",
    "https://developer.kroger.com/assets/logos/copps.svg",
    "https://developer.kroger.com/assets/logos/food4less.svg",
    "https://developer.kroger.com/assets/logos/smiths.svg",
    "https://developer.kroger.com/assets/logos/gerbessuperscript.svg",
    "https://developer.kroger.com/assets/logos/kroger.svg",
    "https://developer.kroger.com/assets/logos/payless.svg",
    "https://developer.kroger.com/assets/logos/kingsoopers.svg",
    "https://developer.kroger.com/assets/logos/jayc.svg",
    "https://developer.kroger.com/assets/logos/homechef.svg",
    "https://developer.kroger.com/assets/logos/qfc.svg",
    "https://developer.kroger.com/assets/logos/fredmeyer.svg",
    "https://developer.kroger.com/assets/logos/citymarket.svg",
    "https://developer.kroger.com/assets/logos/foodsco.svg",
    "https://developer.kroger.com/assets/logos/picknsave.svg",
    "https://developer.kroger.com/assets/logos/harristeeter.svg",
    "https://developer.kroger.com/assets/logos/ruler.svg",
    "https://developer.kroger.com/assets/logos/metromarket.svg",
    "https://developer.kroger.com/assets/logos/owens.svg",
    "https://developer.kroger.com/assets/logos/ralphs.svg",
    "https://developer.kroger.com/assets/logos/roundys.svg",
    "https://developer.kroger.com/assets/logos/marianos.svg"

  ];

  const mapImages = () => {
    return (
      groceryStores.map((store, index) => (
        <div className="col-lg-2" key={index}>
          <img src={store} style={{ width: "100px" }} />
        </div>
      ))
    )
  }

  return (
    <>

      <header className="masthead">
        <div className="container h-100">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="text-uppercase text-white font-weight-bold">The best grocery todo app in the world </h2>
              <hr className="divider my-4" />
              <p className="text-white-75 font-weight-light mb-5">Search for grocery items in nearby grocery stores, save recipes for future meals, get total cost of grocery items and so much more!!</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">

              <video width="1000" height="640" autoPlay muted loop className="shadow">
                <source src={searchRecipeVideo} type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
            </div>
          </div>
        </div>
      </header>
      <section className="page-section bg-dark text-white" id="about">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">Shop for items in these locations!!</h2>
              <hr className="divider light my-4" />
              <div className="row">
                {mapImages()}
              </div>

            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container-fluid p-25">
          <div className="row no-gutters">
            <div className="col-lg-6 col-sm-6">
              <a className="portfolio-box" href="assets/img/portfolio/fullsize/1.jpg">
                <img className="img-fluid shadow" src={require(`../../images/favMeals.png`)} alt="" />
              </a>
            </div>

            <div className="col-lg-6 col-sm-6">
              <section className="page-section">
                <div className="container text-center">
                  <h2 className="text-uppercase font-weight-bold">Never lose your favorite receipes again!</h2>
                  <hr className="divider my-4" />
                  <p className="font-weight-light mb-5">Save your recipes for your next family gatherings! Add the recipe to the list and let your spouce to the shopping</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section bg-dark text-white">
        <div className="container-fluid">
          <div className="row no-gutters  justify-content-center">
            <div className="col-lg-6 col-sm-6">
              <section className="page-section">
                <div className="container text-center">
                  <h2 className="text-uppercase font-weight-bold">Cant decide on your next meals for you family?</h2>
                  <hr className="divider my-4" />
                  <p className="font-weight-light mb-5">Let grocery todo decide them for you. It will randomly select a variety of meals. If you love it, click and add to the list.</p>
                </div>
              </section>
            </div>
            <div className="col-lg-6 text-center">

              <video width="800" height="440" autoPlay muted loop className="shadow">
                <source src={randomRecipes} type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container-fluid">
          <div className="row no-gutters  justify-content-center">
            <div className="col-lg-6 text-center">

              <video width="800" height="440" autoPlay muted loop className="shadow">
                <source src={realTimeUpdates} type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
            </div>
            <div className="col-lg-6 col-sm-6">
              <section className="page-section">
                <div className="container text-center">
                  <h2 className="text-uppercase font-weight-bold">Real time updates!!</h2>
                  <hr className="divider my-4" />
                  <p className="font-weight-light mb-5">Spouce is shopping already and you forgot to add desserts to the lists? Curious on how much items your spouce has left to pick? Wondering if your spouce is slacking? Let this app, provide you with real time updates. </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section  bg-dark text-white" >
        <div className="container  text-center">
          <div className="row no-gutter">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              <Link to="/ContactUs"> <button className="btn btn-info">Contact Us</button> </Link>
              <button className="btn btn-info">Support</button>
            </div>
            <div className="col-lg-3"></div>
          </div>

          <footer className="bg-dark py-2">
            <div className="container"><div className="small text-center text-muted">Copyright © 2020 - Start Bootstrap</div></div>
          </footer>
        </div>
      </section>
    </>
  );
}
