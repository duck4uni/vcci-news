import { Suspense } from "react";
import { FeaturedNews, FeaturedNewsSkeleton } from "./components/featured-news";
import { Advertisements } from "./components/advertisements";
import { HorizontalAdBanner } from "./components/horizontal-ad-banner";
import { News } from "./components/news";
import { Events, EventsSkeleton } from "./components/events";
import { BusinessOpportunities, BusinessOpportunitiesSkeleton } from "./components/business-opportunities";
import { PolicyAndLaws, PolicyAndLawsSkeleton } from "./components/policies-and-laws";
import { EventsCalendar } from "@/components/base/events-calendar";
import { Banner } from "./components/banner";
import { FeaturedMembers } from "./components/featured-members";
import { MemberConnection, MemberConnectionSkeleton } from "./components/member-connection";
import { Videos, VideosSkeleton } from "./components/videos";
import { Partners } from "./components/partners";

export default function HomePage() {
  return (
    <div>
      <h1 className="sr-only">
        Liên đoàn Thương mại và Công nghiệp Việt Nam, CN TP.HCM
      </h1>
      <Banner />
      {/* contents */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-6">
        <Suspense fallback={<FeaturedNewsSkeleton />}>
          <FeaturedNews />
        </Suspense>

        <section className="flex flex-col xl:flex-row pb-8 gap-5 mb-0">
          <News />
          <Advertisements count={3} startIndex={0} />
        </section >

        <HorizontalAdBanner />

        <section className="flex flex-col gap-5 xl:flex-row xl:items-stretch" >
          <Suspense fallback={<EventsSkeleton />}>
            <Events />
          </Suspense>
          <EventsCalendar />
        </section >

        <div className="flex flex-col lg:flex-row gap-5" >
          <div className="flex flex-col flex-1">
            <section className="flex flex-col xl:flex-row gap-5">
              <div className="flex flex-col md:flex-row gap-5 pt-8 flex-1 order-2 xl:order-1">
                <Suspense fallback={<BusinessOpportunitiesSkeleton />}>
                  <BusinessOpportunities />
                </Suspense>
                <Suspense fallback={<PolicyAndLawsSkeleton />}>
                  <PolicyAndLaws />
                </Suspense>
              </div>
              <Advertisements count={2} startIndex={3} />
            </section>
          </div>
        </div >

        <section className="flex flex-col gap-5 pb-8 xl:flex-row xl:items-stretch">
          <FeaturedMembers />
          <Suspense fallback={<MemberConnectionSkeleton />}>
            <MemberConnection />
          </Suspense>
        </section>
        <section className="flex flex-col gap-6 pb-10 xl:flex-row xl:items-stretch">
          <Suspense fallback={<VideosSkeleton />}>
            <Videos />
          </Suspense>
          <Partners />
        </section>
      </div>
    </div>
  );
}
