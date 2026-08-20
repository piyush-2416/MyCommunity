import React from 'react'
 import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
 const communityFeatures = [
  {
    title: "Elder Care",
    description: "Care, respect & support for our elders.",
    image:
      "https://img.magnific.com/free-vector/grandparents-day-older-characters-icon-isolated_24911-109256.jpg",
    icon: "👵",
    tag: "Care",
  },
  {
    title: "Animal Safety",
    description: "Report, rescue & protect animals.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/011/466/678/small/animal-rescue-team-is-taking-care-of-wild-animals-vector.jpg",
    icon: "🐾",
    tag: "Animals",
  },
  {
    title: "Trees & Plants",
    description: "Make our community greener together.",
    image:
      "https://static.vecteezy.com/system/resources/previews/029/454/798/non_2x/planting-plants-illustration-with-people-enjoy-gardening-plant-watering-or-digging-in-the-garden-in-flat-kids-cartoon-background-design-vector.jpg",
    icon: "🌱",
    tag: "Environment",
  },
  {
    title: "Blood Donation",
    description: "Donate blood and help save lives.",
    image:
      "https://media.istockphoto.com/id/1852205337/vector/doctor-working-with-patient-in-hospital-doctor-collects-blood-from-man.jpg?s=612x612&w=0&k=20&c=04alId1qs46HoJoQPgkihQzSMaZhDunLlM3auWltEMI=",
    icon: "🩸",
    tag: "Health",
  },
  {
    title: "Lost & Found",
    description: "Help your neighbors find lost items.",
    image:
      "https://st2.depositphotos.com/33417770/42168/v/1600/depositphotos_421680902-stock-illustration-man-returning-lost-wallet-to.jpg",
    icon: "🔎",
    tag: "Community",
  },
  {
    title: "Dogs & Community",
    description: "Adopt, report & care for community dogs.",
    image:
      "https://static.vecteezy.com/system/resources/previews/046/885/275/non_2x/a-cartoon-illustration-of-a-man-kneeling-down-and-petting-his-dog-while-outdoors-in-a-park-free-vector.jpg",
    icon: "🐶",
    tag: "Pets",
  },
];
function Home() {
  return (

    <div>  <Navbar/>
       <div className="Main-image">
        <img src="" alt="" />
      </div>

      <div className="quick-section">
  <h2>Quick Actions</h2>

  <div className="quick-list">

    <div className="quick-card">
      <span className="quick-icon">🚨</span>
      <div>
        <h3>Raise Complaint</h3>
        <p>Report a community issue</p>
      </div>
      <Link to="/Complaints"><span className="arrow">→</span></Link>
    </div>

    <div className="quick-card">
      <span className="quick-icon">📝</span>
      <div>
        <h3>View Notices</h3>
        <p>Check latest updates</p>
      </div>
      <Link to="/Notice"><span className="arrow">→</span></Link>
    </div>

    <div className="quick-card">
      <span className="quick-icon">📅</span>
      <div>
        <h3>Upcoming Events</h3>
        <p>See community events</p>
      </div>
      <Link to="/Event"><span className="arrow">→</span></Link>
    </div>

    <div className="quick-card">
      <span className="quick-icon">🆘</span>
      <div>
        <h3>Emergency Help</h3>
        <p>Get urgent assistance</p>
      </div>
      <Link to="/Emergency"><span className="arrow">→</span></Link>
    </div>

    <div className="quick-card">
      <span className="quick-icon">☑️</span>
      <div>
        <h3>Voting/Poll</h3>
        <p>vote the Things for community</p>
      </div>
      <Link to="/Business"><span className="arrow">→</span></Link>
    </div>

  </div>
</div>
      <hr />
<div className="service-section">
  <h2>Popular Services</h2>

  <div className="service-list">
<div className="service-card">
      <span>🏥</span>
      <h3>Medical</h3>
      <p>nearby doctor, ambulance, health center</p>
    </div>
    <div className="service-card">
      <span>💧</span>
      <h3>Water Supply</h3>
      <p>water shortage/leakage complaint</p>
    </div>
 <div className="service-card">
      <span>💡</span>
      <h3>Street Light</h3>
      <p>broken/non-working light report</p>
    </div>

    <div className="service-card">
      <span>🛡️</span>
      <h3>Security Help</h3>
      <p>security guard, suspicious activity report</p>
    </div>

    <div className="service-card">
      <span>🛒</span>
      <h3>Grocery</h3>
      <p>Nearby grocery shops</p>
    </div>

  </div>
</div>
     <div className="business-section">
  <h2>Local Businesses</h2>

  <div className="business-list">

    <div className="business-card">
      <img
        src="https://img.freepik.com/premium-vector/poster-gym-with-gym-gym-with-gym-background_1092808-11549.jpg?w=2000"
        alt="Gym"
      />

      <div className="business-info">
        <div>
          <h3>Fitness Center</h3>
          <p>🏋️ Gym</p>
        </div>

        <button>→</button>
      </div>
    </div>


    <div className="business-card">
      <img
        src=" https://www.gogreenorganicsupermarket.com/assets/images/home/organic-food-grocery.webp"
        alt="Grocery"
      />

      <div className="business-info">
        <div>
          <h3>Green Grocery</h3>
          <p>🥦 Grocery Store</p>
        </div>

        <button>→</button>
      </div>
    </div>

    <div className="business-card">
      <img
        src="https://tse2.mm.bing.net/th/id/OIP.H7JSuiPNPSWFAWsizdf8gAHaFx?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Tutor"
      />

      <div className="business-info">
        <div>
          <h3>Bright Academy</h3>
          <p>📚 Tutor</p>
        </div>

        <button>→</button>
      </div>
    </div>
     
         <div className="business-card">
      <img
        src=" https://static.vecteezy.com/system/resources/previews/007/004/740/non_2x/circle-business-icons-set-free-vector.jpg"
        alt="Tutor"
      />

      <div className="business-info">
        <div>
          <h3>View More</h3>
          <p>All business</p>
        </div>

        <button>→</button>
      </div>
    </div>




  </div>
</div>
      
      <img className="community-Trees" src="" alt=""/>
            <section className="community-features">

      <div className="community-feature-heading">
        <div>
 
          <h2>
            Make Our Community
            <span> Better Together</span>
          </h2>

          
        </div>

        <button className="view-all-btn">
          View All →
        </button>
      </div>

      <div className="community-feature-grid">

        {communityFeatures.map((feature, index) => (
          <div className="community-feature-card" key={index}>

            {/* Image */}
            <div className="feature-image-wrapper">
              <img
                src={feature.image}
                alt={feature.title}
                className="feature-image"
              />

              <span className="feature-icon">
                {feature.icon}
              </span>

              <span className="feature-tag">
                {feature.tag}
              </span>
            </div>

            {/* Content */}
            <div className="feature-content">

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <button className="feature-action">
                Explore
                <span>→</span>
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
    <hr/>
    <div className="quick-section">
  <h2>Community-Highlights</h2>

  <div className="quick-list">

    <div className="quick-card">
      <span className="quick-icon">☘️</span>
      <div>
        <h3>Clean & Green Drive </h3>
        <p>Join the cleanlines</p>
        <p>📅25-jule-2026</p>
      </div>
      {/* <span className="arrow">→</span> */}
    </div>

    <div className="quick-card">
      <span className="quick-icon">🩺</span>
      <div>
         <h3>Free Health Camp</h3>
        <p>Genral Health check-up<br/>for everyone</p>
        <p>📅30-Augest-2026</p>
      </div>
      {/* <span className="arrow">→</span> */}
    </div>

    <div className="quick-card">
      <span className="quick-icon">🪴</span>
      <div>
        <h3> plats a free </h3>
        <p>Let's grow the most trees together</p>
        <p>📅2-octorber-2026</p>
      </div>
      {/* <span className="arrow">→</span> */}
    </div>

    <div className="quick-card">
      <span className="quick-icon">🦮</span>
      <div>
        <h3>Pet Adoption Process</h3>
        <p>Give them a Home</p>
        <p>📅10-December-2026</p>
      </div>
      {/* <span className="arrow">→</span> */}
    </div>
      <div className="quick-card">
      <span className="quick-icon">🌐</span>
      <div>
        <h3>Better connection </h3>
        <p>Better connection with your neigbours</p>
        
      </div>
      {/* <span className="arrow">→</span> */}
    </div>

 

  </div>
</div>
{/* Footer-section */}
<footer className="bg-green-600 p-10 text-base-content footer sm:footer-horizontal">
  <nav>
    <h6 className="footer-title">Services</h6>
    <a className="link link-hover">Branding</a>
    <a className="link link-hover">Design</a>
    <a className="link link-hover">Marketing</a>
    <a className="link link-hover">Advertisement</a>
  </nav>
  <nav>
    <h6 className="footer-title">Company</h6>
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav>
  <nav>
    <h6 className="footer-title">Legal</h6>
    <a className="link link-hover">Terms of use</a>
    <a className="link link-hover">Privacy policy</a>
    <a className="link link-hover">Cookie policy</a>
  </nav>
  <form>
    <h6 className="footer-title">Newsletter</h6>
    <fieldset className="w-80">
      <label>Enter your email address</label>
      <div className="join">
        <input
          type="text"
          placeholder="username@site.com"
          className="input join-item" />
        <button className="btn btn-primary join-item">Subscribe</button>
      </div>
    </fieldset>
  </form>
</footer>
    </div>
  )
}

export default Home
