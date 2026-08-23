<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <div class="report">
    <header class="report-header">
      <p class="eyebrow">프로젝트 소개</p>
      <h1>날씨 대시보드</h1>
      <p class="subtitle">실시간 날씨와 대기질 정보를 한눈에 확인할 수 있는 웹 서비스</p>
    </header>

    <section class="report-section">
      <h2>기획 의도</h2>
      <p>
        날씨는 숫자로만 존재하지 않습니다. Apple Weather 같은 미니멀한 감성을
        가져오되, 대기질 데이터를 단순한 수치로 보여주는 대신 화면 전체의
        명도 대비로 체감하게 하고 싶었습니다. 그래서 색을 걷어내고 흑백의
        대비만으로 정보의 위계와 분위기를 표현하는 모던 모노크롬 대시보드로
        설계했습니다.
      </p>
      <p>
        레이아웃은 noth.in 같은 에디토리얼 사이트의 타이포그래피 중심 구성에서
        영감을 받았습니다. 이미지와 큰 텍스트가 화면을 채우고, 기능은 절제된
        여백 속에 조용히 자리하는 방식입니다.
      </p>
      <p>
        기본 요구사항 위에, 여러 도시를 나란히 담아보는 비교함과 전세계 지도를
        얹어 데이터를 더 넓게 탐색할 수 있게 했고, 단위 전환은 세그먼트 토글로
        다듬어 한눈에 상태를 파악하게 했습니다. 다크모드는 전역 테마 변수로
        구현해 라이트/다크 어느 쪽에서도 같은 명도 대비 원칙이 유지되고,
        좁은 화면에서는 상단 내비게이션이 접히고 펴지도록 해 모바일에서도
        레이아웃이 흐트러지지 않게 했습니다. 도시 목록 페이지에는 API에 없는
        도시도 직접 입력해 추가할 수 있는 기능을 더했고, 실습 과정 자체는
        별도의 실습기록 페이지에 기록해두었습니다.
      </p>
    </section>

    <section class="report-section">
      <h2>기술 스택</h2>
      <table class="stack-table">
        <tbody>
          <tr>
            <th>Vue 3 Composition API</th>
            <td>상태·로직을 컴포저블/스토어 단위로 나누고 재사용하기 위해</td>
          </tr>
          <tr>
            <th>Vue Router</th>
            <td>감성 메인과 기능 페이지(도시 목록, 즐겨찾기, 상세)를 독립된 화면으로 분리하기 위해</td>
          </tr>
          <tr>
            <th>Pinia</th>
            <td>여러 페이지가 같은 날씨 데이터를 중복 요청 없이 공유하기 위해</td>
          </tr>
          <tr>
            <th>Axios</th>
            <td>OpenWeatherMap, Air Pollution, Sunrise-Sunset API를 호출하기 위해</td>
          </tr>
          <tr>
            <th>Leaflet</th>
            <td>도시별 위치와 기온을 지도 위 마커로 시각화하기 위해</td>
          </tr>
          <tr>
            <th>Element Plus</th>
            <td>el-tag, el-dialog, el-button 적용</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="report-section">
      <h2>트러블슈팅 로그</h2>

      <div class="trouble-card">
        <h3>1. 데이터와 함수를 착각</h3>
        <div class="trouble-row">
          <span class="trouble-label label-problem">Problem</span>
          <p><code>@click="configStore"</code> 클릭 시 "configStore is not a function" 에러</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-cause">Cause</span>
          <p>configStore는 여러 상태와 함수를 담은 객체인데 객체 자체를 클릭 핸들러로 넘겨서 발생</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-fix">Fix</span>
          <p><code>@click="configStore.toggleWindUnit"</code>처럼 객체 안의 실제 함수를 지정</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-lesson">Lesson</span>
          <p>참조하는 대상이 데이터인지 함수인지 항상 구분해야 한다</p>
        </div>
      </div>

      <div class="trouble-card">
        <h3>2. 오타</h3>
        <div class="trouble-row">
          <span class="trouble-label label-problem">Problem</span>
          <p><code>class="nav=links"</code> — 콘솔 에러 없이 스타일만 조용히 안 먹음</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-cause">Cause</span>
          <p>하이픈(-)이 등호(=)로 오타나서 CSS 선택자가 매칭되지 않음</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-fix">Fix</span>
          <p><code>class="nav-links"</code>로 수정</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-lesson">Lesson</span>
          <p>에러가 없다는 게 코드가 맞다는 뜻은 아니다</p>
        </div>
      </div>

      <div class="trouble-card">
        <h3>3. 라이브러리의 기본값이 만든 오차</h3>
        <div class="trouble-row">
          <span class="trouble-label label-problem">Problem</span>
          <p>지도 위 마커가 실제 도시 위치보다 오른쪽 아래로 어긋남</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-cause">Cause</span>
          <p>Leaflet의 iconAnchor를 지정하지 않아 기본값(아이콘 좌상단)이 좌표 기준점이 되어버림</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-fix">Fix</span>
          <p><code>iconAnchor: [16, 16]</code>으로 배지 중심을 좌표에 맞춤</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-lesson">Lesson</span>
          <p>동작은 하는데 미묘하게 이상하면 라이브러리의 기본값을 의심하라</p>
        </div>
      </div>

      <div class="trouble-card">
        <h3>4. 기본 스타일 코드에 대한 이해 부족</h3>
        <div class="trouble-row">
          <span class="trouble-label label-problem">Problem</span>
          <p>카드 개수가 바뀔 때마다 전체 레이아웃 폭이 줄었다 늘었다 함</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-cause">Cause</span>
          <p>Vite가 기본 생성한 <code>body { display: flex; place-items: center }</code> 때문에 #app이 flex item으로 취급되어 내용물 크기에 따라 폭이 흔들림</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-fix">Fix</span>
          <p>body의 <code>display: flex</code> 제거, 컴포넌트에 <code>width: 100%</code> 안전장치 추가</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-lesson">Lesson</span>
          <p>버그의 원인이 항상 방금 작성한 코드에 있는 건 아니다</p>
        </div>
      </div>

      <div class="trouble-card">
        <h3>5. 눈에 보이는 증상과 실제 원인이 다른 층위에 있던 경우</h3>
        <div class="trouble-row">
          <span class="trouble-label label-problem">Problem</span>
          <p>온도 28~33도인데 뱃지가 파란색으로 표시됨</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-cause">Cause</span>
          <p>computed 함수 tempTagType은 정확했지만 template에서 <code>:type="tempTahType"</code>으로 오타나서 존재하지 않는 변수가 바인딩됨</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-fix">Fix</span>
          <p>오타 수정</p>
        </div>
        <div class="trouble-row">
          <span class="trouble-label label-lesson">Lesson</span>
          <p>로직이 맞다고 확신할 때는 그 로직이 실제로 연결된 지점까지 의심 범위를 넓혀야 한다</p>
        </div>
      </div>
    </section>

    <section class="report-section">
      <h2>회고</h2>
      <p>
        이번 프로젝트에서 가장 많이 마주친 버그는 복잡한 로직 오류가 아니라,
        사소한 오타였다. -와 =, Tag와 Tah처럼 사소해 보이는 차이가 기능 전체를
        조용히 무력화시켰다. 이 경험을 통해 콘솔에 에러가 없다고 안심하지 않고,
        실제 렌더링 결과를 항상 눈으로 확인하는 습관을 갖게 됐다.
      </p>
    </section>

    <button class="home-btn" @click="goHome">메인으로 돌아가기</button>
  </div>
</template>

<style scoped>
.report {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 20px 100px;
  font-family: sans-serif;
  color: var(--text-body);
}

.report-header {
  text-align: center;
  margin-bottom: 64px;
}
.eyebrow {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 16px;
}
.report-header h1 {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: var(--text-body);
  margin: 0 0 16px;
  line-height: 1.3;
}
.subtitle {
  font-size: 15px;
  font-weight: 300;
  color: var(--text-body);
  opacity: 0.75;
  margin: 0;
}

.report-section {
  margin: 64px 0;
}
.report-section h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-body);
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-glass);
}
.report-section p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-body);
  margin: 0 0 14px;
}
.report-section p:last-child {
  margin-bottom: 0;
}

.stack-table {
  width: 100%;
  border-collapse: collapse;
}
.stack-table th,
.stack-table td {
  text-align: left;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-glass);
  font-size: 13px;
  vertical-align: top;
}
.stack-table th {
  width: 190px;
  color: var(--text-body);
  font-weight: 700;
  white-space: nowrap;
}
.stack-table td {
  color: var(--text-body);
  opacity: 0.85;
  line-height: 1.6;
}
.stack-table tr:last-child th,
.stack-table tr:last-child td {
  border-bottom: none;
}

.trouble-card {
  background: var(--bg-panel);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(27, 43, 34, 0.06);
}
.trouble-card:last-child {
  margin-bottom: 0;
}
.trouble-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-body);
  margin: 0 0 16px;
}
.trouble-row {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
}
.trouble-row:last-child {
  margin-bottom: 0;
}
.trouble-label {
  flex-shrink: 0;
  width: 68px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-top: 1px;
}
.label-problem {
  color: #b4573f;
}
.label-fix {
  color: #4a7a52;
}
.trouble-row p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-body);
}
.trouble-row code {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--accent-block);
  padding: 1px 5px;
  border-radius: 4px;
}

.home-btn {
  display: block;
  margin: 64px auto 0;
  padding: 12px 32px;
  border: none;
  border-radius: 999px;
  background: var(--accent-block);
  color: var(--accent-block-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.home-btn:hover {
  background: #14211a;
}
</style>
