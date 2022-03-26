import { Auth, Button } from "@supabase/ui";
import type { NextPage } from "next";
import Head from "next/head";
import { useQuery } from "urql";
import { gql } from "../gql";
import { Container } from "../lib/container";
import { FeedItem } from "../lib/feed-item";
import { Loading } from "../lib/loading";
import { MainSection } from "../lib/main-section";
import { noopUUID } from "../lib/noop-uuid";

const NewestRouteQuery = gql(/* GraphQL */ `
  query NewestRouteQuery($profileId: UUID!) {
    feed: postCollection(orderBy: [{ createdAt: DescNullsFirst }], first: 15) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          ...FeedItem_PostFragment
        }
      }
    }
  }
`);

const Newest: NextPage = () => {
  const { user } = Auth.useUser();
  const [newestQuery] = useQuery({
    query: NewestRouteQuery,
    variables: {
      profileId: user?.id ?? noopUUID,
    },
  });

  return (
    <Container>
      <Head>
        <title>supanews | Newest</title>
        <meta name="description" content="What is hot?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainSection>
        <section className="text-gray-600 body-font overflow-hidden w-full">
          <div className="container px-5 py-24 mx-auto">
            <div className="-my-8">
              {newestQuery.fetching && <Loading />}
              {newestQuery?.data?.feed?.edges.map((edge) => (
                <FeedItem post={edge.node!} key={edge.cursor} />
              ))}
            </div>
          </div>
          {newestQuery.data?.feed?.pageInfo.hasNextPage ? (
            <div className="flex justify-center content-center">
              <Button>Load more.</Button>
            </div>
          ) : null}
        </section>
      </MainSection>
    </Container>
  );
};

export default Newest;
