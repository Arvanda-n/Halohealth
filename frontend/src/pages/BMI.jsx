import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function BMI() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [stress, setStress] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const heightMeter = height / 100;
    const bmi = (weight / (heightMeter * heightMeter)).toFixed(1);

    let status = "";
    if (bmi < 18.5) status = "Kurang Ideal";
    else if (bmi < 25) status = "Ideal";
    else status = "Berlebih";

    setResult({ bmi, status });
  };

  return (
    <>
      <Header />

      <div className="bmi-container">
        {/* CENTER */}
        <div className="bmi-main">
          <h1>Kalkulator BMI</h1>
          <p>Cek Body Mass Index kamu secara mandiri</p>

          {/* Gender */}
          <div className="gender-select">
            <div
              className={`gender-card ${gender === "male" ? "active" : ""}`}
              onClick={() => setGender("male")}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87Gr4eFO7Pt2pE8oym4dxXnxGZYL2Pl_N5A&s" />
              <span>Laki-laki</span>
            </div>

            <div
              className={`gender-card ${gender === "female" ? "active" : ""}`}
              onClick={() => setGender("female")}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDC16AsldgZpB00C0o0Fjo0_CNdh8l5NL5A&s" />
              <span>Perempuan</span>
            </div>
          </div>

          {/* Input */}
          <div className="bmi-form">
            <input
              type="number"
              placeholder="Tinggi (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="Berat badan (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <select value={stress} onChange={(e) => setStress(e.target.value)}>
              <option value="">Tingkat Stres</option>
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>

            <button onClick={handleCalculate}>Hitung BMI</button>
          </div>

          {/* RESULT */}
          {result && (
            <div className={`bmi-result ${result.status.replace(" ", "-").toLowerCase()}`}>
              <h2>BMI Kamu</h2>
              <h1>{result.bmi}</h1>
              <p>
                Untuk {gender === "male" ? "Laki-laki" : "Perempuan"}, kondisi tubuh kamu
                <strong> {result.status}</strong>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="bmi-info">
          <h3>Apa itu BMI?</h3>
          <p>
            Body Mass Index (BMI) adalah metode sederhana untuk mengetahui apakah berat
            badan kamu ideal atau tidak.
          </p>

          <div className="info-card">
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMWFRUXFxcaFxUXGBgYGBoXFRcaFxgYGBkYHSggGBolHRkWITEhJSkrMC4uGB8zODMsQygtLisBCgoKDg0OGxAQGy0lICUvLTUtLi0tLS0vLS01LTUuLS0tLS0tLS0tLS0tLS0tLS0tLS0tNS0tLS01Ly0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABAUGAwIHAQj/xABPEAACAQIEAgYDCwgGCQUBAAABAgMAEQQFEiExQQYTIjJRYSNxgQcUM0JSYnKRobLBNENzgpKiscIVJNHS4fBjZHSDk6Okw9NEU1SztCX/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACwRAQEAAgIBAgMIAwEBAAAAAAABAhEhMRIDQVFhwSIycYGRoeHwQrHREwT/2gAMAwEAAhEDEQA/APuNKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKVUQdIYnxsmCQMzxxiSRwB1a6iAsZN7hyCGtbhRZLVvSlKIUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgp+lmergsLJiG3IFkT5cjbIv18fAAnlUHoBkT4bDl5t8TiGMuIY8db7hP1QbWG19VuNU4//p5p44TL2/Vkxf4hPsI8GrfVmc3bpl9nHx/UpSlacylKUClKUClKUClKUClKUClKUClKUClKUClKUClKUClKUClKUCsx0/z18NhwkO+JxDdVAo4622L+QUG9+Fyt+NXOYZzh4CBNPHGTwVnUE+oE3NYvonMuPzGbHOy6YLxYSIkagvx5il7jVcgG3BiD3RWbfZ0wx/yvUavopkSYLCx4ddyou7fLkbd2333PDwAA5Vb0pWmLbbulccXikiRpJGCIouWY2A9prtXxj3S+khnxZwyN6KA2PgZODMfO90HhpfxoRtMV7pWDU2VJnHJlRVBPqkZW+yvGF90zCMwWRJYr/GIVh9SMW+oGvlTC+9j2SN7GwLAgAngCRqsOdj4VBxcgIIO9uXMeYH+eFDfyf0nhMUkqCSN1dG4MpBB9ortX88dC+mL4KUG5aJj6Rb31Cw3+mBYq3MCx8a/oPDzq6q6EMrAMrDgVYXBHkRQrpSlKIUpSgUpSgUpSgUpSgUpSgUpSgUpSgUrD9IOm00WMaDDYb3zHAgbE6O+pfuhN9yBvpsb35WJq+6OdKsLjVJgkGod+NuzIltjqU+e1xcedTcbuGUm3Lpt0h95YYyKNUzkRwJx1Svsu3MDiRztbmKwuedPcdDEcLNEkWJ2vNGwZShHeRd9LnhudtzYXFrLKnOZZg2NO+GwxMWFHJ5PjzDxHCx+jwKmsH00ws8mYYoLHJJpksdKs1hYBL2G11Aqd8tWa+zrlXRTkkkkkk3JJJJPiSdyfM17kmIIIJBBuCDYg+II3B8xUjKujuLc2XDTH1oVH7T2X7a22We5mzrfEy6D8iKxI9bsCD6gvtNW5Rjxva69zPpY2KVoJm1SxjUrHi8d7b+LKSATz1LxNzW5r4/g8nfKszw5GqWOXWi6QAzXU+jNyFuDoa5IBAvtY2+s4LFLKiyLcA8jsQQbMp8wQQfVUllMsbOXev5ly3CzY3FskYvJI7MxPBb7u7HkBf948eB/pqvl+R5acvxOIGpIzNi1iiZoWlusqmSG5WRdKXDqfFl47Uyulwm2u6PdGocNh+oChw28hYA62PEsDfblbfYc+Jy3TH3OEkQyYQaJBuEv2T5Lfu38O7w7vGtwhXEJxdQHdTpZo2vE7RsLqbgalPA77VHyCL0SyNE0MjA642kd7WYjix34A3tzrDW/i/moYZ+taIoQ97aLHUHDW0gcb3I2472r+g/csd/6OijlBEkTSIysCHWzkqrKd1Ogra/Ig864Zz0WBx8GPiCh4w/WA37Y0EIeyDdgbeZFvCrPowZGeR5O8IcPHJ+nQO8g22NhJGpI5gj4tamW6lxknDQ0pStuZSlKBSlKBSlKBSlKBSlKBSlKBVL0wz5cFhXnI1P3Yk+XK2yLYbnxNuQNXVfOzJ/SOZGTjhcCxVPkyYn4zeYTa3qBHeNS1rGTu9RY9CsjbDwWkOrETMZZ2PEyPuRfy4eu55146RdD8PijrIMUwvaeLsvwsdVtnFtt97E7itOnZXVzOw9XjXCr4zWnPzy8vLfLCZfmGKylFixEIlwqbLicOu6DjeWP2klvtY1b9EsyhlxmJmidWE6puBb8nVd2vvqImHG3wZHI1pKzWKyGHDSjGQqIwrXnjUejeMgo7FfilVd32423HOs5Y11x9TG277rYRzq3dZW9RB/hUDNM16q4VLkAEu56uJb8A0hBuT4IGO4uBcVFzHAJDFJMrG66H1dlbJHIspUaFAC2Wx8RxJq7eMEgkAlTcEgGx4XHgbE/XWV4U3SewhjmcC8U+Ha4BNtUqxvp2uey7jhferLIImXDxB1KuV1Op4h5O2wPnqY1Fz8XjRRxOIwth9HERu37qsfZV1VxnKW8aKqMYoTFRubWlTqyfnx6pIv3TPv6qt6iZpguujKX0nYo/HS6EMjW52YA258OdasZl5QsiUiI6gQxlnYggi2qd2A34ixG42PEVY1SRyyzAgSPFIpVZYU6q6HmQ0iNqQ7sptuDy4CRPPFhEsS7MzHShZpJZXPJdRufsVQLnSBtzbs5VnS3MJwsqYdirJEp2AuZJpVWJQzKQNllB2v21O2xrSZdg1hiSJeCjjzJO7MxO5ZiSSTuSSaz2KwrR4aSWW3WF0mlI4DQ6NpB2uqoiqDtcLfma1VawM+pClKVtzKUpQKUpQKUpQKUpQKUpQKUrzI4UFmIAAJJOwAG5JPhQZf3Q88eCBYYN8ViW6qEDiL7NJ5BQePIkede+juUJhMPHh03CDc8NTHdm9pv6thyqg6Mk47Fy5o4PVi8ODU8o1JDy25FjceIuw5CtiVO3nUx55X1bqeH6/j/D1NJqP8BXilK24lfhFQZMczMY4E6xlNnYnTEh8GYA6n+YoJ4X03Bqu6R5axw7CWVpHkKxqoGiIPKRGPRg3cXbhIz+ys2tY4b7fmA6QxQyDBsWmiIIjkRGkCqLgwuVBD6QGAK3OlSGA0lmmw51DqBfHYZVW1oYmQEngFcsSxHCyqqm458K85xhIxLArKpjKPEFIBGpQskdr+Cxy1UI0krOuGmkjRG0F2eSS52LBFc7JY2DauN7DYE4uNdplN6dM/zLETTRHCnq+p1yBXS5PonAeRDYxK19Cg2c63a1lq+wfSdQ3V4herOhHE35l1cEhr8Y+BuG2B21G4vQ5bjPQvEihJeuaJbDvMXZRMQSS3ddmuST1b1b5xl2mFGhB14ZfRjiWjVQHiN+OpVHH4yrfnVk0eW7qxqKVlYZBDCJ8PLHHDYHqpW0wWtwR+MHsuvzd71PgzqSZA0UDILXaSf0aLbjYC7SW4giykcHq7TxcOmaRBI2ZT1hlhRGS6yaTKjSAOpDKmgMW34D1VOweVRREsiDURYubs5A4Au12I9Zr59Fm5lmmaZndhJAisRpSOJ9EwAS/YMgDE8SNMYYkitPFmkmKBKP1Ue2yg9aQwDKS7AaAVI7oJ8HrOvKrlfCcrPPMbCEaGQ6jIpHVKC0jKw0nsjcLvbUbAX3IqpyPO8VGdOLGtVjVnaMAmG22qaxsQ3aNkDFQhuSDcfohEZEOHRetk33ubAbGWZr6mA8zdjYX4kaPLsEmHi038WkkYi7NbtO54cvUAABYAAXx0xjnudcJisCLg3B4EV+1nOi+P0okToYlkLthr91omZnSMXA0SKlvRngo2vpbTo6su1s1SlKVUKUpQKUpQKUpQKUpQKw3ui495miyqBrSYneZh+bwyntk/SsQPGxHMVrs1zCPDwyTymyRqWY+Q5DxJ4AcyRWA6ISD0uYYk/1jFHUEG5jgHwcY8NrHlcab71Lzw1MphPO/l+LY5bglRUijGlEUKB4KosK7Tvc+XAeqoeY5oIUUabu4uQTYqvK/Hf/ABqnfPZOSqPrP41uR5cvVxnFaGqrNcTctHrMcaLrxEouCqHgisO6zWJLDdVF9iysIH9NS/N+r/Gp+TprwskjgXmMrt4EXKJ/y0jFTKN+lnMrv4LnDwKihEUKqiwUCwA8qq8/V9UDLGXWOQu6ggEhUbTa+1wxU7kcDVVlWdzBYoSsfc0pI7N6RobxyjZbBwyMdPMbjnafipcQ6lD1IB8NZrPbvZZXbHR+/MLeJmiZhricgXVxex5ix3FwSCGuCdqosEpdyYCIohDAmjQCysoc6Rc2UqrIDcHlwtvY5YMVFGI+shZV2QlHuEHdUnX2rcL8bWvc7mPBgJ0aQq8AEkhkIEL7MwGr86L3IJufHyFDj4ufR7DA4vSSWbDrKSx2Le+ZNcTkLZbgHErw+Va16mdJsazFsOAdCoGltYNIHJWOBL/Lbsk+YXm2n30edllmSbSJX0lCoIV4o1203J7QZnutzbUOIN65YU++sxuPg4BudrM0bMq38R1jPbwOHJ51PZr3XuUZEkYV5AJJgN5DuFJ4iIH4NOVhubAkk3J8556V48IOEl3m/QIRqU7W7bFUtzUvbhXfLp2eadrnQrLGq8roup3HrMmn/d1FwUn9em0jUpjQPJawjeIkiPUdmuJC1h3dJv3lqs+7MdMcEJYcy0KFNhYiw1PFGsoa/jqYrf5tWE0ZicFBqZ0SJI72LOhYpysFClyzcgt97VEMoaBN/wApkaQk8ondsQ+rwAj7F+V1rQdHcKXJxTggsNMKkWKxEg3IO4aQgMfABAQCDeufOV1eufpPolZZgPe8bu15ZWGqRlHacgbIik7KOCrf1kkkmA00mNRFEfV4eSzOzMGZ4+9oAS6hW2udR7Nxbe4n5lnCoxijHWzW+DBsFvwaVtxGv2mx0hrVzyyP3rhnaVyQvWSubWAuWkbSvxVFyFW5sABc8ajo7Z3oMfUtE8uvuom1tJBDdYSBGVNiG1A3HZuRXHJ8VMmmDFW6wglJFN1kCngx0raUAi4sA27KB2lSXlETrEplJMjXdxe4Vn3KL81e6PJRXDpJ2YDNwMBEwPgI95APpR9YvqY0+ZPgtKUpVZKUpQKUpQKUpQKUqm6XZ8uCwsk5F2HZjT5cjbIu2/Hc25A0WS26jH9PcYcZiky5D6KHTLijyLcY4j94jzB+LVpkuA7RkkHo49z5kcAP8+HjVN0Vyl44+2S2ImYySseJkfe3sv6uJrTZnIEUQLwXdz4t/h/nhVxn7vN62cyy46x6+d/v7KPHTNI7OwNyfqHIewVHqzoRW3kvKnxkpWN2AuVViB4kDYfXW6wmDEcKQjgkaoPUq6fwrLYiLUY0Fu1NEP1Q4dx+wrVsqxl29n/zzWO2ZynBJPBNA42WYlTwILhZgykbgh2bcbgjavODxTxv1E57XBJNgJPJrbCS3hs3EW3VZWSrbF4oXNtENhy7+IF/Xa31CrLM8uSZCrj2/aPt38juKy9FqLSq2DEPC4gnN77Ryng/grHk/gfjeR2qzqpYj43CLIukkg3urqdLow4MjcmG/wBZBuCRXjogVg62KTSsoAK2FlaCJQqmPyBLFl4q0ngVJpM9ctiFQtIFVHYdWbE2A1FbX1SKpaRVIIbqipB1C0mWPrV964g2kK6op4zYOpGkTQtvY2axXe2qxuGBbNvLpJfH5NZ0YjIwsTEENIDKwPENOxlYewuR7KqMTOUhx0YNmaVUjI4g4iOKJW9khc/qmuMHSLEI7JJHGFgiV5AFb0qBmWSSFtXZCKEYxlSbnTfgxj9Ki64yHqgGMqkhflPFdYr/ADQcQ7sfCK/KmzV2gmVJMWysrNFAFjWJAC0zAB3QXsBED1QdmKqTGi3N2FavqMViPhH6iM/EiJLkb96UgEctkCkH45rp0f6Px4WPSO25JaSRu87k3Zm87k7cByq4q6Z3JNREwGWxQrpjQKLk+07knxJPE8TzqLnnbMMA/OSAt5Rw+ka/ipKoh/SVa1l8Xj2OJfqgGlsYIAdwLaXxExt+bBManh2ogOLClMeauDjy0/UxgEINUznguodhB4ue95KN+8tc+lJHvLFX4e95r/8ADapOV4BYYwgJY7lnbvO7bs7W5k+Gw2AsABUfpFcxCMbmSSJLeKtIvWf8sOfZT2J2sl4V+0pVZKUpQKUpQKUpQK+X5vjP6QzA23w2CYqvg+J+M3mE4DzHg1ab3Q8/bDYcRw/lOIPVQgcQTs0nkFB4+JW9VXRbIxGkeHTgouzeJ4u3tPD2Cp3U9TLww47vE+t+i5wA6qMzHvHsxjz5n/PgfGq0m+541LzPEh2svcUWUeQ5+3+yoddHgyvtClK/QKMv3ApqxUI+SJZP2VEX/erVVm8kIOJNviwke13X+5WjrF7e705rCKLKT/XcV9CH7ZMR/ZV7VLkgvPim+dGv7Ot/+5V1SOlRswwSTIUcAgjnWVyvNCrGKUkoHCRzE3uxVWCSH5XaADfGIsd7athL3TbwP8KxfR3De+lbDvGSnvmZ5SynSY0fsKDwbUwUEfJSQGpWsZvt+dLAY9GIBKhOy7gXKKSCJQOeh1jkI5iNhzq1y3Luvi6qSMonfjZT2sPNwkjjJG8dzqRrFWRyttIAPnFYc4c9VN24G7KSNuVvsI5SeI5K59Tb2ZveDjnwyhICskSiywy3UqOSpKoJCjwZW8ARas2b5amWppMyzI3SXrZplltG0agR6Oy5UsXuzXPZUWFufHa1X0TIlxh1XLYPDrhl1cWfrJFkkHyrrFF2h8th4ipcudSTEwxo0DgAuz6SVU3GqIAkSE2NiQAOJB7p95JlEDSSo0SsqpABqGoggytq1HfVdr6r3ub3pJe085Ps+7VUqr/ol0+BxEqfMc9chPn1l5LeQcU6vGWt1mHB+X1Un2J1m37R9taZ0l5hjkhQu97cAALszHgqqN2Y+FVnRXKDChkl3mlZnfhZA7tII1tyBdiTzYsfACszKLFpiomkaKdCGEQsYQsgW7/L1OYw5BPJXHZvvoMtzISEowZJF3MbjSwB+MLEq68tSki+173FPdqzU4T6rMT28VEnKNXlPk7eij9hVp/qqzqryztT4lzyaOIHxWOMP9+WQeylZi0pSlVClKUClKUCvLuACSQABck7AAcSa/WYAXJsBxJrB+6Tm5kWLLsOw14oXkdTfRhvjN+tYqPEBhzFS3TWM3VNgcScdi5Mwa/VLeLCqfkKSGktyLG/nuRyFX8chW9iRcWNvA8q4YXDrGixoLKoAUeQ2rrW8ZqPB63qeee/0/ApSlVyBXOeUC616kmtsDvUNjeqqy6LG+In8ooP3nm/uitPWb6JL28Q36Jf2Q7fz1pK5vfj92KHosulsUgFlGIuDtuzRRs3r3IO/j7BfVT9HB+UHxxDfZFEPwq4qRvLsqhx5kwj9dAAySOokgJsCzba0PxGsPUbWNu8L6qjpI1lh850+xXb8KUx7TsNmmHxSlLgNbtRSABwDsbqe8p3FxdTvYmqRMswXvuOFEhJ0yFlQAW2W2oJwPhfxNWOYZJFLxUeoqGF/Gx4Vwy/LlixUKg/m5zYDSBpMQ4D6dKsvwQumOUxwpFJCGjk6+BBIrMSqyzxo9gxK7qSLEEVbdEUfTNI7Bi0xCsoKgrEqxXsSbdpX589ql9I8pGKgaEmxJVgdxZkYOpupB2ZVOxB8xxqsyrOJR1kC4VNOGZYj1clh8EjjSrJsNLr8ap1V7nz+jT0qmXPjezYWdfnehYfUkhb7K9r0jw3x3MXK8yPCL+AaQBW9hNXbOqtSKixZZEsnWiNessR1lhqsbXF+PBVH6o8KkxuGAKkEHgQbg+o16qorc/zQYeLXa7syRxr8qSRgqA23tc3J5AE1IyzB9VGE1FjdmZjsWd2Lu1uV2J25Cw5VVYjFDFSpFF24o5FeWQdy8R1KitwZ+sVbgcArXtdb39Rq8TRSlKrJSlKBSlKDA9P8a2KmjymFra7PinHxIQbhPpMbbfRuLNVPjugkmFcz5fYgixw8vNb3tHIdxvyJ48+VarpP0JTESHFQSvhsVYDrU3V9IsBIh2YWAHsF72Aqli6V4rBEQ5nDpUmy4mMF4W8Nxuh8j5mwFY9+Xbm46x6958f78uVXlXSFXYxMGhmXZoZBZr/ADb94er12q6XEeIqfmeU4TMIgXCyC10lQjWvO6OOV+W48qyOMwGOwNywOMww+Ovw6L89fjW8d/G68K6eWu3jy9DHL7nF+F+l/wCtGJl8/VXiSW422qBlOaQ4hA0ThrcuBF/EHcVMcgC1bjzXG43Vcai5pjlgieZ+CC9vE8AB6zYVKqBk2A9/48IRfDYQh5PB5/iJ5hdyfUQeIqZXUdPQ9Pzy56na89zbCSph5WnFpZJy7Dw1RREL5WG1uVrVrRVfkhJjZj8abEEea9e4Q/sBanObAnwFc509md3VV0a+DkPjNL9h0/hVvWcyXHiLDKdLOXxE6qqabkiWUnvsqgBUJ3I4eYFTxnI5wzD9VD91zSUsu1pVF0pP5MP9Y/hh5/8ACpDZ9Eu7rKg5s0TlR5kqCFHmdhXHPrNJhQN/SMw/YK3/AH6Eml2ahKv9diPhh8R+9Jh/7pr9xWaQRtpkmjRrA6WZQbG9jYnhsfqqDh8wMuJLYYwyhIlVm6w2Bkcmw0K1zaMEg27y0pjL21FUeQpbEY3zljb/AJKL/LUjK81aSWSCRFWSNY3Ohy6lZS4XcqpDXja4tzG5vXHLGtjMUnzIH/bMy/8AbourNrhkB4gGuT4RDyt6q6TyhVLHgBc+yqnDZnPJGkiwxFXVWHpmvZgCPzVr2PjVTQ/RqC5ZAY2O5aItExPmYipb216myFXAWWWSRB+bZuyfpj84PJ7jyr0c1lHHCSnzR4SP3pFP2V2wuao7iMq8bkEhXUi4HGzC6ki/AG9TheXPo3GFw6hRYapCAOA1Sufxqzqs6OteG3yZZ1/YnkX8Ks6RL2UpSqhSlKBSlV3SDOI8Jh5MTL3Y1vbmx4KovzJsPbRZN8RY1g/dFxzTvFlMBs89nnYb9Xh1Nz7WI+y3xhUbDe6NNBGGzHBvEHTVHJFdo2JGpY2BJMbnYbn1gV+9AMOWSTHTMGxGLbWxBuFj+JGp8ALfYD3azvy4jpq+nPK/l+P8OOI6GSYduty2YxH42HlJeF/O/FW8/tWpeW9MFDiDFocNNsLPbSxPDQ/A3/Hia1VVHSLLIcQgSZA6m+x4jzUjdT5ir466cf8A0mX3/wBff+VbnfQvD4hjNETh5+UsWwJ+emwbz4E8zWbxOMxODOnHR3jvYYqIEofDWoF0Ps9QPGvGFnxeDxTYXBmTGRpGJHhNtcS37qvzNiCFtwIsOJrT5R0lhxilVbtC4khcBXXkQy8xyPEVJeeOK3nhfH7U8p+8/wCf6Z7N82tCpw5EkkpCQhSDqdthb1efO16+i9EMgXBYVIAbt3pH+XI3fbffyF+QFfM86yVMNjMK+AHV4qSWyR2DR6bWkcqe6Ap3tyvaxF6+zVd23kmGOGEmPuy2W5kkKLh5tSSRKquSraCbd8SAFLN3rEgi+4FdpOkGDII99QcCLdal+Hhe9T8bg5RIZodDFlVXjclQwQsVZXAOlhqa91N+zwteoWY4rEGORFwkiuUYCRngMSkgjUbSayo47LfbhWd2LqVm8N1nV4YxAH0mLkAe6iRHe4INrr8LcNY3t4G9T2zGQccNJ+q0Z/iwpFscCv8Aqcn1j3r/AI1Y1qJlVHmecyCKQrA6sI5GBdogo0rux0OzEC44Dw8anNBoky+HkkLj/h+91/E1C6Qblv0DL7JZY1P8BVvit8ZhfKGb7TD/AGVF9v1QZszjTGTxyOqXEJUuwUNdWBCk8SNINvnCu2WZmFmnAR5QTGwkj0uoUppCHtXuGR22BHbFeYlDz4q4vaVV+qGNv5qm5BEqyThQAPRDbx0k/wACPrqpwj9HGY5ji5CrKskWG0BhZiI+sBNuQuTx3qxhsuZSDm+FjPsjlk/8hr3C39dsOUC3/Xd9P3G+uoOMcrnGH8Hwk6+0SRP/AABqNd38vosOl0mnBzkf+1J9kbGuGQMFRoNg0LsunwjLFotvDQVF+F1I5V06ZC+DnHjFIPrjYVwbAxyzzCVFcqyMhYAlFeMLZTxXtIx28TV92Z0tqg5zH6Mya1jaL0iSN3VZQb6vmFSyt81ja3GubZHFyaZfo4idR9SyAVGnymJZMOe0/ph8I7ycI5CPhGO4YKfWBSk0n9FXvASVKkyzsVPFesmeTSfMarVcVW5NxnHhO/7yo381WVIl7KUpVQpSlAr5/wC6bh52kw0hgefBQt1k0cVi5cX0lkPeQDw8WvbY19ApUs21jl43bNZRnODx8RMbK6kWdCL7Hk8bb29lj4ms7jehrwMZctl6k3JbDuSYHvx80Pnvblar/pD0IgxDddEzYXE3uJ4eyS3+kUWDjx4E+NZ+XP8AG4Ahcxi6yG9hjIQSvl1qAdk+wbmwBqX5tSX/AA/S/wB5/wBuWXdL9L9Ri0bCT8lc+jbzR+Fvs5AmrTP83XDwPiJDcKNh4k91R6z+JqRjfeuNgsypPG3dPGx4XVgbqw8t6xWYdG54GhZC2MwsMgkGFdrONPAK1jrUfJ9ljc0tsjOOOGWXPHy/v1br3OcibD4czTD+s4k9bMTxF90j8goJ25FmqV0m6G4bGHWwMU47uIiOmQEcLkd4ev2EVL6M9I4cbEZIdQKnS6ONLo9rlWHj6rirekk0uWWUy31WN6JdD5oMQ+Kxc64iXQIomC6dMYNySOAY7eNu1ub1sqUqyaZyytvJUXNGtDKfCNz9SmpVRM3HoJf0b/dNUiixuXO8UDxECWJQVDbK4KAMjEbi44HkQDY2tUN80C7SQzRt4dWz/U0WoEe2tBg/g0+gv8BXaobY2WGTFSqI42WLSA8jjTsJFksq8SToA3tYMauMSLY2AeET/aw/sq6qmxH5dH+i/mf+yhvaJPDJBLK/VPJFK/Wao+0yNoVCGTiVsikFbm5O1fmTZg+vEdXCzAyKdT3iseoiXSQ66rdm9wCN60tR8kN5cV5TIP8ApoT+NFleMlw0hkeaUKGbSAqksFVAbLqYAsbs5vYd61trmu6Qi2ZZc/8AtCn9aMAfbWqrLdLTafCNzEqD2PNEh+wml6XG8rXpLhjJhpUXvMjqPWykD7SKgZTiRLPJKvdeHDEesmYkHwIBW4rREX2qofo9GHaSJnhZzdjGxAY/KZO6zfOIJ86My8aTKh5j3oP0y/de/wBl68/0NN/82f8AYw//AIa6YbJiHR5MRLLoJZVYRqoYqVv6NFvszcb8b8hQfuTN6XGDwxC/bhcOfxq1qsy0WnxQ8Xjb64UX+SrOkKUpSqhSlKBSlKBXl0BBBAIIsQdwQeIIr1SgwebdATExnyyQYeQ7tA1zh5PLT+bPmNhyA41nsx6XSxI8EuGeHHGyxR21JI7kKrRtwYAkG1+O1zX12ucsCsVLKrFTdSQCVPC4vwPnWdfB085fvTan6GZAMFhUhveQ9uV+OuVu8b8+QHkoq8pStSaYttu6UpSiFRsz+Bl+g/3TUmo2ZfAyfQf7posQ8EfRx/QX7orvXDA/BR/QX7orvRKVS4nbHR+cX8zf21dVR5kbY3D/ADo5P3Xi/v0IvKiZB8LjP9oX/wDJhql1GyMelxf6ZD/00A/CpVnut6y/TBrMjfISST/hWf8AlrUVmOlcPWMY/lYbFL9cdvxpelx7aelc8PLqRW+UoP1i9dKrJSlKCrwrf1ydf9Fh2/aadf5KtKrIltjZD8rDw/uSTf36s6kWlKUqoUpSgUpSgUpSgUpSgUpSgUpSgVGzL4GT6D/dNKUWIuE+DT6K/wABXalKMlUua/lWF+jN9+ClKlWLqo+UfC4n9In/ANMdKVVi1qjzT8oT9FP91KUqUnawyf8AJ4f0cf3RUylKpeylKURX/wDqv9z/AD1YUpRaUpSiFKUoP//Z" />
            <span>Membantu pantau kesehatan</span>
          </div>

          <div className="info-card">
            <img src="https://img.icons8.com/fluency/96/running.png" />
            <span>Menentukan gaya hidup sehat</span>
          </div>

          <div className="info-card">
            <img src="https://img.icons8.com/fluency/96/apple.png" />
            <span>Kontrol pola makan</span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
