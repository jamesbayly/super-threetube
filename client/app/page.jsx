"use client";
import { useState, useEffect } from "react";
import { message, Row, Col, Card } from "antd";
import Link from "next/link";
import { subgraphClient as client, GET_VIDEOS_QUERY } from "./utils";
import VideoCard from "./components/VideoCard";
import styles from "./page.module.css";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titleSearchInput, setTitleSearchInput] = useState("");
  const [categorySearchInput, setCategorySearchInput] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    client
      .request(GET_VIDEOS_QUERY, {
        first: 200,
        skip: 0,
        orderBy: "createdAt",
        orderDirection: "desc",
        where: {
          ...(titleSearchInput && { title_contains_nocase: titleSearchInput }),
          ...(categorySearchInput && {
            category_contains_nocase: categorySearchInput
          })
        }
      })
      .then((data) => {
        // duplicate first 1 video to 12 videos to simulate pagination
        data.videos = Array.from({ length: 12 }).map(() => data.videos[0]);
        setVideos(data.videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to fetch videos. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVideos();
  }, [titleSearchInput, categorySearchInput]);

  return (
    <>
      <Row gutter={[16, 16]} justify="center" className={styles.grid}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  loading
                  style={{ borderRadius: 20 }}
                  cover={
                    <div
                      style={{
                        height: 150,
                        borderRadius: 20
                      }}
                    />
                  }
                />
              </Col>
            ))
          : videos.map((video) => (
              <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                <Link href={`/watch/${video.id}`}>
                  <VideoCard video={video} />
                </Link>
              </Col>
            ))}
      </Row>
    </>
  );
}
