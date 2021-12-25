import React from "react";
import PropTypes from "prop-types";
import { Image } from "antd";
import { IMAGE_FALLBACK } from "../../assets/fallback_image";

const ColImage = (props) => {
  const { src, width } = props;

  if (typeof src === "string")
    return <Image src={src} width={width} fallback={IMAGE_FALLBACK} />;

  if (!Array.isArray(src))
    return <Image src="error" width={width} fallback={IMAGE_FALLBACK} />;

  return (
    <Image.PreviewGroup>
      {src.map((item, index) => (
        <Image
          key={index.toString()}
          src={item}
          width={width}
          style={{ padding: "0 0.5rem 0.5rem 0" }}
          fallback={IMAGE_FALLBACK}
        />
      ))}
    </Image.PreviewGroup>
  );
};

ColImage.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  width: PropTypes.number,
};

ColImage.defaultProps = {
  width: 100,
};

export default ColImage;
