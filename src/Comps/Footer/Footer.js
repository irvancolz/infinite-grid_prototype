class Footer {
  constructor() {
    this.$ui = document.createElement("div");
    this.$ui.className = "footer";
    this.$ui.innerHTML = `
    <ul class="navigation">
        <li><a href="#" class="link">buy hosico</a></li>
        <li><a href="#" class="link">x twitter</a></li>
        <li><a href="#" class="link">telegram</a></li>
        <li><a href="#" class="link">official website</a></li>
      </ul>
    <h2 class="footer_title">Hosico gallery</h2>
    `;
  }
}

export default Footer;
