
export const handleRedirectSettings = (props) => {
    props.history.push("/settings");
    props.onRedirect();
}