(function () {
    class MediaExtractor {
        extractInstagram() {
            let postUrls = new Set();

            // Post data object depends on if you're logged in or not.
            let postData = window.__additionalData[window.location.pathname];
            if (postData) {
                postData = window.__additionalData[window.location.pathname].data.graphql.shortcode_media;
            } else {
                postData = window._sharedData.entry_data.PostPage[0].graphql.shortcode_media;
            }

            // Multi-media posts
            if (postData.edge_sidecar_to_children) {
                postData.edge_sidecar_to_children.edges.forEach(edge => {
                    let node = edge.node;
                    if (node.video_url) {
                        postUrls.add(node.video_url);
                    } else {
                        postUrls.add(node.display_url);
                    }
                });
            }

            // Single-media posts
            if (postData.is_video) {
                postUrls.add(postData.video_url);
            } else {
                postUrls.add(postData.display_url);
            }

            return postUrls;
        }
        extractTwitter() {
            let postUrls = new Set();

            document.querySelectorAll("img[src*=\"format\"").forEach(elem => postUrls.add(elem.src.substring(0, elem.src.lastIndexOf("&name="))));

            return postUrls;
        }
        extractVsco() {
            let postUrls = new Set();

            // Grab videos instead of thumbnails if videos exist
            let video_url = document.querySelectorAll("meta[property=\"og:video\"");
            if (video_url.length > 0) {
                postUrls.add(document.querySelectorAll("meta[property=\"og:video\"")[0].content);
            } else {
                let image_url = document.querySelectorAll("meta[property=\"og:image\"")[0].content;
                postUrls.add(image_url.substring(0, image_url.lastIndexOf("?h=")));
            }

            return postUrls;
        }
        extractMedia() {
            if (window.location.host.includes("instagram.com")) {
                return this.extractInstagram();
            } else if (window.location.host.includes("twitter.com")) {
                return this.extractTwitter();
            } else if (window.location.host.includes("vsco.co")) {
                return this.extractVsco();
            }
            return [];
        }
    };

    (new MediaExtractor()).extractMedia().forEach(url => {
        console.log(url);
        window.open(url, "_blank");
    });
})();