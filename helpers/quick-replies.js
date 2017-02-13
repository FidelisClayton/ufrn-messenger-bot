export default function({ title, payload, image_url }) {
  return {
    content_type: "text",
    title: title,
    payload: payload,
    image_url: image_url
  }
}
