import MembershipForm from "@/components/MembershipForm"
import Link from "next/link"

export default function MembershipPage() {
  return (
    <div className="membership-page">
      <section className="membership-hero">
        <h1>Join the African Cup Political Party</h1>
        <p>Be part of the movement shaping Africa's future through Pan-Africanism and continental governance</p>
      </section>

      <section className="membership-content">
        <div className="membership-info">
          <div className="vision-section">
            <h2>Our Vision</h2>
            <h3>Vision Statement</h3>
            <p className="vision-quote">
              "To establish an African global power-base, through a continental government built on a new leadership
              inspired by our common interest." A leadership built on the idea of Pan-Africanism, trained for, and by
              Africans, and subsidized by Africans.
            </p>

            <div className="vision-content">
              <p>
                This Pan-African vision of continental governance system is inspired by historical events that have
                shaped the face of our continent. In fact, the current African geography and its internal institutions
                were created by Europeans who had no other vision except, to conquer and exploit African resources.
                Consequently, the African vision should not be built on the foundation of the European vision, it should
                be aiming to establish a new foundation on which the future will be based, and that is our aim.
              </p>
              <p>
                Especially, after a half century of the so-called African independence we have tried to protect and
                defend the foundation established by the oppressors for our destruction, and the result is, we have
                turned ourselves into tools of self-destruction. However, it is never too late to do things right, it is
                never too late to lay a new foundation of unity, Ubuntu and prosperity. Finally, it is never too late to
                be in charge again.
              </p>
            </div>
          </div>

          <div className="mission-section">
            <h2>Our Mission</h2>
            <p>
              Based on our vision of setting a global power-base which is also our supreme guide. We have as a primary
              mission, "To create new leaders through our school of future African leaders in politics and in business,
              we also aim to put new faces and ideas in leadership positions in countries around the continent."
            </p>

            <div className="mission-content">
              <p>
                Firstly, we believe that development is an inside-out process, rather than outside-in process,
                therefore, a society cannot be called developed on the basis of infrastructure only, if its people are
                not fully developed. Consequently, we focus on the mind transformation of our people. As people become
                aware of themselves and their reality worldwide, being mentally developed, they will be able to reflect
                their mental development onto their environment.
              </p>
              <p>
                Secondly, we are aware that the world including Africa is at the time of danger and opportunity, our
                chance to survive depends on what type of leadership we put in charge and in which direction it is
                taking us. For that reason, we have an academy called 'The Free-Minded', a new school for future African
                leaders in politics and business. Through this education system, we will create political and business
                leaders who are fit for the future of Africa.
              </p>
              <p>
                Also, we are working in collaboration with all Africans around the world to design an agenda that takes
                into account all aspects of our respective communities and countries. In fact, we are not just creating
                leaders, we want to put them in positions of power in our respective communities and countries in order
                to fulfill our common vision.
              </p>
              <p>
                Finally, we are aiming to work and strengthen our common position in order to create a continental
                agenda in all areas of activities for the future African generations and their leaderships.
              </p>
              <p>Above all, our mission is to working with you.</p>
            </div>
          </div>

          <div className="membership-benefits">
            <h2>Why Join ACUP?</h2>
            <div className="benefit">
              <h3>Leadership Development</h3>
              <p>Participate in our leadership academy and become a future leader in African politics and business</p>
            </div>
            <div className="benefit">
              <h3>Continental Impact</h3>
              <p>Contribute to shaping Africa's future through our continental governance initiatives</p>
            </div>
            <div className="benefit">
              <h3>Community Building</h3>
              <p>Join a network of like-minded individuals working towards African self-determination</p>
            </div>
          </div>
        </div>

        <div className="registration-section">
          <h2>Register Now</h2>
          <p>Start your journey with ACUP today</p>
          <MembershipForm />
          <p className="existing-member">
            Already a member? <Link href="/membership-card">Get your membership card</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
