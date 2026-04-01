export default function Header() {
  return (
    <div className="header-bar">
      <div className="row align-items-center">
        <div className="col text-start ms-3">
          <div className="header-bar-container d-flex align-items-center">
            <img
              className="logo-header"
              src="AllForOne_Logo.png"
              alt="Logotipo do site AllForOne"
            />
          </div>
        </div>
        <div className="col text-end me-3">
          <button className="btn btn-primary ms-1 btn-header bg-white text-dark border-black">
            Login
          </button>
          <button className="btn btn-success ms-1 btn-header">Cadastro</button>
        </div>
      </div>
    </div>
  );
}