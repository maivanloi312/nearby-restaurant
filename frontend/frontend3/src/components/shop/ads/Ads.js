
import '../../../css/Introduce.css'
const Ads=()=>{
    
    return (<div id="cont" className="container" style={{backgroundImage: 'url(image/fineas-gavre-CE_1ZBQ__Ns-unsplash.jpg)'}}>
    <div className="overlay" />
    {/* top nav*/}
    <div className="nav">
      <div className="menu" onclick="openNav()">
        <div className="hamburger-line" />
      </div>
      <div className="logo">
        TAZAS
      </div>
      <div className="chat">
        <i className="bx bx-chat" />
      </div>
    </div>
    {/* end top nav */}
    {/* nav menu */}
    <div className="nav-overlay">
      <div className="nav-overlay-content">
        <a href>Shop</a>
        <a href>About</a>
        <a href>Service</a>
        <a href>Clients</a>
        <a href>Contact</a>
      </div>
    </div>
    {/* end nav menu*/}
    {/* social icon*/}
    <div className="sci">
      <i className="bx bxl-facebook-square" />
      <i className="bx bxl-instagram-alt" />
      <i className="bx bxl-youtube" />
      <i className="bx bxl-twitter" />
    </div>
    {/* end social icon*/}
    {/* fashion label*/}
    <div className="fashion">
      FASHION
    </div>
    {/* end fashion label*/}
    {/* product info */}
    <div className="col-5 z-index-99">
      <div className="info">
        {/* info 1*/}
        <div className="product-info">
          <h1>CREA<span className="txt-yellow">TIVE</span></h1>
          <h1><span className="txt-yellow">DE</span>SIGN</h1>
          <span>Collection 2021</span>
          <p>Fashion is a subject that most girls like to talk about. People may think that all the clothes, accessories, perfume, shoes etc. are mostly for women; however, men also play a big role in the fashion industry, both in manufacturing and consuming. Some of the world famous fashion designers are Alexander McQueen, Marc Jacob, Tom Ford, Christian. They are all men, but they can create the dreams about outfit of all the girls.</p>
          <button>SHOP NOW</button>
        </div>
        {/* end info 1 */}
        {/* info 2 */}
        <div className="product-info active">
          <h1>
            <span style={{color: '#01e257ab'}}>passion</span>nate
          </h1>
          <h1>
            pur<span style={{color: '#01e257ab'}}>suit</span>SIGN
          </h1>
          <span>Collection 2021</span>
          <p>Fashion is a subject that most girls like to talk about. People may think that all the clothes, accessories, perfume, shoes etc. are mostly for women; however, men also play a big role in the fashion industry, both in manufacturing and consuming. Some of the world famous fashion designers are Alexander McQueen, Marc Jacob, Tom Ford, Christian. They are all men, but they can create the dreams about outfit of all the girls.</p>
          <button>SHOP NOW</button>
        </div>
        {/* end info 2 */}
        {/* info 3 */}
        <div className="product-info">
          <h1>
            <span style={{color: '#01e257ab'}}>BE</span>
          </h1>
          <h1>
            <span style={{color: '#01e257ab'}}>Your</span>self
          </h1>
          <span>Collection 2021</span>
          <p>Fashion is a subject that most girls like to talk about. People may think that all the clothes, accessories, perfume, shoes etc. are mostly for women; however, men also play a big role in the fashion industry, both in manufacturing and consuming. Some of the world famous fashion designers are Alexander McQueen, Marc Jacob, Tom Ford, Christian. They are all men, but they can create the dreams about outfit of all the girls.</p>
          <button>SHOP NOW</button>
        </div>
        {/* end info 3*/}
        {/* info 4 */}
        <div className="product-info">
          <h1>
            <span style={{color: '#01e257ab'}}>FR</span>EE
          </h1>
          <h1>
            STY<span style={{color: '#01e257ab'}}>LE</span>
          </h1>
          <span>Collection 2021</span>
          <p>Fashion is a subject that most girls like to talk about. People may think that all the clothes, accessories, perfume, shoes etc. are mostly for women; however, men also play a big role in the fashion industry, both in manufacturing and consuming. Some of the world famous fashion designers are Alexander McQueen, Marc Jacob, Tom Ford, Christian. They are all men, but they can create the dreams about outfit of all the girls.</p>
          <button>SHOP NOW</button>
        </div>
        {/* end info 4 */}
      </div>
    </div>
    {/* end product info */}
    {/* product image slide */}
    <div className="col-7">
      {/* slider*/}
      <div className="slider">
        <div className="slide" style={{left: '0px', height: '603px', transform: 'unset', opacity: 1, animation: 'unset'}}>
          <div className="img-holder" style={{backgroundImage: 'url(image/bruce-dixon-cPj2ZKmrDxs-unsplash.jpg)'}} />
        </div><div className="slide" style={{left: '314px', height: '483px', transform: 'unset', opacity: 1, animation: 'unset'}}>
          <div className="img-holder" style={{backgroundImage: 'url(image/dimitry-zub-_qhTq885sqs-unsplash.jpg)'}} />
        </div><div className="slide" style={{left: '538px', height: '362px', transform: 'unset', opacity: 1, animation: 'unset'}}>
          <div className="img-holder" style={{backgroundImage: 'url(image/freestocks-8hAsLeE6Fbo-unsplash.jpg)'}} />
        </div><div className="slide" style={{transform: 'scale(0)', opacity: 0, left: '538px', height: '362px', animation: 'unset', zIndex: 0}}>
          <div className="img-holder" style={{backgroundImage: 'url(image/allef-vinicius-8UOwLzt4RoI-unsplash.jpg)'}} />
        </div></div>
      {/* end slider*/}
    </div>
    {/* end product image slide*/}
    {/* slide control */}
    <div className="slide-control z-index-99">
      <i className="bx bxs-right-arrow" />
    </div>
    {/* end slide control */}
  </div>
  )
}
export default Ads