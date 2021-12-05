import React from "react";
import PropTypes from "prop-types";
import { Image } from "antd";
import { IMAGE_FALLBACK } from "../assets/fallback_image";
import _ from "lodash";

const ColImage = (props) => {
  const { src, width, keyUrl } = props;

  if (!src || (Array.isArray(src) && !src.length)) {
    return <Image src="error" width={width} fallback={IMAGE_FALLBACK} />;
  }
  if (typeof src === "string") {
    return <Image src={src} width={width} fallback={IMAGE_FALLBACK} />;
  }
  if (typeof src === "object" && !Array.isArray(src)) {
    return (
      <Image
        src={_.get(src, keyUrl) || _.get(src, "url") || _.get(src, "uri")}
        width={width}
        fallback={IMAGE_FALLBACK}
      />
    );
  }

  return (
    <Image.PreviewGroup>
      {src.map((item, index) => (
        <Image
          key={index.toString()}
          src={
            _.get(item, keyUrl) ||
            _.get(item, "url") ||
            _.get(item, "uri") ||
            item
          }
          width={width}
          style={{ padding: "0 0.5rem 0.5rem 0" }}
          fallback={IMAGE_FALLBACK}
        />
      ))}
    </Image.PreviewGroup>
  );
};

ColImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  width: PropTypes.number,
  keyUrl: PropTypes.string,
};

ColImage.defaultProps = {
  width: 100,
  keyUrl: "",
};

export default ColImage;
