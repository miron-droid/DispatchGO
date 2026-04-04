import { PrismaClient, UserRole, ContentStatus, LessonType, ProgressStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getContent(chapter: number, lesson: number): object {
  const contents: Record<string, object> = {
    '1-1': {
      type: 'text',
      bodyRu: `
        <h2>Введение в грузоперевозки США</h2>
        <p>Транспортно-логистическая отрасль США крайне конкурентна для всех её участников — будь то водитель, брокер, перевозчик или owner-operator.</p>
        <p>Чтобы добиться успеха в транспортной логистике США, необходимы развитые коммуникативные навыки, умение адаптироваться к меняющимся условиям рынка и стремление оказывать только качественные услуги.</p>
        <p>Тем не менее потенциал для успеха высок — каждый год огромное количество новых игроков входит на рынок транспортных услуг с разных сторон. Это отражает растущую роль транспортной логистики в экономике США. В результате этот сектор продолжает расширяться и привлекать всё больше инвестиций.</p>
        <blockquote>
          <strong>Запомните:</strong> Это ВЫСОКОКОНКУРЕНТНЫЙ бизнес на каждом этапе и в каждом звене цепочки транспортной логистики — ВОДИТЕЛЬ, БРОКЕР, ПЕРЕВОЗЧИК. Это необходимо понимать.
        </blockquote>

        <h3>Как работает система</h3>
        <p>Логистика в США — одна из ключевых систем, на которых держится вся экономика. Практически каждый товар, который вы видите в магазине, на складе или заказываете онлайн, в какой-то момент своего пути перемещается на грузовике.</p>
        <p>Этот процесс называется <strong>freight transportation</strong> (грузоперевозка). Основной метод внутренних поставок — <strong>trucking</strong> (перевозка грузов большегрузными автомобилями по всей стране).</p>
        <p>Если говорить просто, логистика — это перемещение товаров из точки А в точку Б. Есть компания с грузом, есть тот, кто его перевезёт, и система, связывающая их. Вся отрасль построена вокруг этих взаимодействий, но внутри она гораздо сложнее и включает несколько ключевых ролей и процессов.</p>

        <h3>Три главных участника</h3>
        <p>Понимание рынка начинается со знания того, кто в нём участвует. В американской логистике есть три основных стороны.</p>
        <p>Первый — <strong>shipper</strong> (грузоотправитель) — компания, у которой есть товары и которой нужно их доставить. Это могут быть заводы, склады, дистрибьюторы или крупные e-commerce компании.</p>
        <p>Второй — <strong>broker</strong> (брокер) — посредник, который находит перевозчика для груза. В большинстве случаев грузоотправители не работают напрямую с водителями или перевозчиками — они обращаются к брокерам.</p>
        <p>Третий — <strong>carrier</strong> (перевозчик) — компания, владеющая грузовиками и нанимающая водителей для выполнения фактической перевозки.</p>

        <h3>Как движется груз</h3>
        <p>Процесс работает следующим образом. У грузоотправителя есть отправка, которую нужно перевезти — это называется <strong>load</strong> (груз). Брокер берёт этот груз и публикует его на специализированных платформах — <strong>load boards</strong> (биржах грузов) — сайтах, где публикуются доступные грузы для перевозчиков и диспетчеров.</p>
        <p>Затем в процесс включается диспетчер: он находит груз, связывается с брокером и обговаривает условия. Водитель забирает груз (<strong>pickup</strong>) и доставляет его в пункт назначения (<strong>delivery</strong>).</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Полуприцеп-тягач 18-wheeler на шоссе США" loading="lazy" />
          <figcaption>Полуприцеп-тягач на шоссе США — основа грузовой транспортировки, ежегодно проходящей миллионы миль</figcaption>
        </figure>

        <h3>Ключевые термины отрасли</h3>
        <p>Работа в логистике означает знание её языка. Вот наиболее важные термины, с которыми вы будете сталкиваться каждый день:</p>
        <blockquote>
          <strong>Load</strong> — сам груз или заявка на перевозку.<br/>
          <strong>Lane</strong> — маршрут, по которому движется груз, например California → Texas.<br/>
          <strong>Rate</strong> — оплата за перевозку груза.<br/>
          <strong>RPM (rate per mile)</strong> — ставка за милю, используется для оценки выгодности груза. Например, если груз оплачивается $2 000 за 1 500 миль, RPM составит примерно $1,33. Этот показатель напрямую влияет на принятие решений и заработок.
        </blockquote>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="Карта часовых поясов США" loading="lazy" />
          <figcaption>Четыре часовых пояса США, с которыми диспетчер работает ежедневно — каждый appointment нужно подтверждать в местном времени точки погрузки или доставки</figcaption>
        </figure>

        <h3>Роли в отрасли</h3>
        <p><strong>Водитель</strong> физически перемещает груз. Он забирает его, следит за сохранностью и доставляет получателю. Без водителей вся система останавливается.</p>
        <p><strong>Перевозчик</strong> — компания, владеющая грузовиками и нанимающая водителей. Это может быть один человек — так называемый <strong>owner-operator</strong> — или крупная флит-компания с сотнями грузовиков.</p>
        <p><strong>Диспетчер</strong> — ключевая роль для каждого, кто входит в эту сферу. Диспетчер управляет всей транспортной операцией. Он не ведёт грузовик, но отвечает за организацию процесса: поиск грузов, общение с брокерами, переговоры о ставках, планирование маршрутов и мониторинг выполнения рейсов. Если кратко — диспетчер является связующим звеном между водителем, брокером и деньгами.</p>
        <p><strong>Брокер</strong> выступает посредником. Он получает груз от грузоотправителя, находит перевозчика и организует сделку. Его заработок — это разница между тем, что платит грузоотправитель, и тем, что получает перевозчик. Эта разница называется <strong>маржой</strong>.</p>
        <p><strong>Consignee</strong> (грузополучатель) — сторона, получающая груз в конечном пункте назначения.</p>

        <h3>Полная цепочка</h3>
        <p>Если собрать всё вместе: грузоотправитель передаёт груз брокеру → брокер находит перевозчика → диспетчер организует перевозку → водитель доставляет груз → грузополучатель принимает его. На каждом этапе — коммуникация, переговоры и контроль.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="Система межштатных шоссе США" loading="lazy" />
          <figcaption>Система межштатных шоссе США — физическая сеть, по которой движется почти весь грузовой транспорт страны</figcaption>
        </figure>

        <h3>Ежедневная работа диспетчера</h3>
        <p>Роль диспетчера является центральной в этой системе. Его главная цель — обеспечить своевременную доставку груза, без проблем и с максимальной прибылью для компании. Ежедневная работа охватывает несколько ключевых направлений.</p>
        <p><strong>Поиск грузов.</strong> Диспетчеры используют load boards для поиска доступных заявок. Когда подходящий груз найден, они его бронируют — берут в работу (<strong>book a load</strong>).</p>
        <p><strong>Общение с брокерами.</strong> Диспетчер звонит, чтобы подтвердить детали и обсудить условия. Один из ключевых навыков — умение <strong>вести переговоры о ставке</strong>, что напрямую определяет доход.</p>
        <p><strong>Планирование маршрута.</strong> Диспетчер должен знать, куда направляется водитель, где он окажется после доставки и какой груз взять следующим. Ключевое понятие здесь — <strong>deadhead</strong> — порожние мили без груза. Эти мили не приносят дохода, поэтому их минимизация является постоянным приоритетом.</p>

        <h3>Во время рейса</h3>
        <p>Пока водитель в пути, диспетчер следит за выполнением рейса. Он отслеживает местоположение водителя, проверяет соблюдение графика и информирует брокера. Широко используемый термин — <strong>ETA (estimated time of arrival)</strong> — ожидаемое время прибытия, которое важно для каждой стороны цепочки.</p>
        <p>Диспетчеры также постоянно решают внештатные ситуации: отменённые грузы, задержки, поломки, проблемы с водителем или сложные переговоры с брокером. Работа требует гибкости, быстрой реакции и умения принимать взвешенные решения под давлением.</p>

        <h3>Заработок и карьерный путь</h3>
        <p>Доход диспетчера, как правило, привязан к результатам. Это может быть процент от стоимости каждого груза или гибридная схема: фиксированная ставка плюс бонусы. Чем лучше грузы находит диспетчер и чем эффективнее он строит маршруты, тем выше его заработок.</p>
        <p>Эта роль сочетает в себе несколько дисциплин сразу: продажи (переговоры о ценах), аналитику (планирование маршрутов и отбор грузов), постоянную коммуникацию (с брокерами и водителями) и стрессоустойчивость (ситуации меняются быстро и требуют моментальных решений).</p>
        <p>Реальность такова, что это не всегда лёгкая работа. Она включает большой объём звонков, частые отказы, значительную ответственность и быстрое принятие решений. Однако она также предлагает хороший потенциал заработка, гибкость удалённой работы и чёткий путь к карьерному росту — вплоть до построения собственного бизнеса.</p>

        <h3>Что вы узнали</h3>
        <p>Изучив эти основы, вы теперь понимаете, как устроена система грузоперевозок США, какие роли существуют, как формируются грузы и как зарабатываются деньги в этой отрасли. Цель на данном этапе — сформировать чёткое представление о процессе, чтобы в следующих уроках перейти к практическим навыкам и инструментам работающего диспетчера.</p>

        <h3>Как движутся деньги в системе</h3>
        <p>Помимо ролей и процессов, важно понять, как реально движутся деньги в логистической цепочке. Каждый перевезённый груз сопровождается финансовой операцией. Грузоотправитель платит брокеру за организацию доставки. Брокер затем находит перевозчика и платит ему за выполнение рейса.</p>
        <p>Разница между тем, что грузоотправитель платит брокеру, и тем, что брокер платит перевозчику — это прибыль брокера, которая называется <strong>маржой</strong>.</p>
        <p>Перевозчик, в свою очередь, платит водителю — или оставляет выручку себе, если работает как owner-operator. Диспетчер получает либо процент от стоимости груза, либо фиксированную плату за выполненный рейс, в зависимости от соглашения. Таким образом, вся система построена на эффективном перемещении грузов, и заработок каждого зависит от того, насколько хорошо эта перевозка организована.</p>

        <h3>Инструменты профессии</h3>
        <p>Работа диспетчера неотделима от инструментов, которые он использует. Телефон — основной инструмент: большинство общения с брокерами происходит по звонкам. Email и электронные подтверждения используются для фиксации договорённостей и обмена документами.</p>
        <p>По мере накопления опыта диспетчеры нередко работают с <strong>TMS (Transportation Management System)</strong> — программным обеспечением, которое помогает отслеживать активные грузы, планировать маршруты и вести контакты перевозчиков и брокеров в одном месте.</p>

        <h3>Типы рынков</h3>
        <p>В грузоперевозках США существует два основных типа рынков грузов, с которыми сталкивается каждый диспетчер.</p>
        <p>Первый — <strong>spot market</strong> (спотовый рынок) — разовые грузы, цена на которые постоянно меняется в зависимости от текущего спроса и предложения. Большинство начинающих диспетчеров начинают именно здесь, учась ориентироваться в меняющихся ставках и быстрых переговорах.</p>
        <p>Второй тип — <strong>contract</strong> или <strong>dedicated</strong> freight (контрактные или выделенные перевозки) — долгосрочные соглашения с фиксированными ставками и предсказуемыми стабильными объёмами. Такие договорённости более распространены среди крупных перевозчиков. Для большинства новых диспетчеров спотовый рынок — основная среда ежедневной работы.</p>

        <h3>Что определяет ставку</h3>
        <p>Ставка за груз — то, сколько он платит, — не фиксирована. Она зависит от нескольких ключевых факторов.</p>
        <p><strong>Расстояние (мили)</strong> — отправная точка: более дальние рейсы, как правило, платят больше в общем, хотя ставка за милю на длинных маршрутах может быть ниже. <strong>Направление (lane)</strong> имеет большое значение — одни коридоры пользуются высоким спросом и хорошо оплачиваются, другие перенасыщены и конкурентны. <strong>Сезонность</strong> тоже влияет: ставки меняются в течение года в зависимости от цикличности отгрузок.</p>
        <p>Помимо этого, <strong>рыночная конъюнктура</strong> — соотношение доступных грузовиков и доступных грузов — напрямую повышает или снижает ставки. Когда грузов больше, чем грузовиков, ставки растут; когда грузовиков в избытке, брокеры давят на снижение. Наконец, <strong>срочность</strong> — важнейший фактор: <strong>hot load</strong> — груз, который нужно перевезти немедленно, как правило, оплачивается по премиальной ставке — но также требует быстрых действий и немедленного исполнения от диспетчера.</p>

        <h3>Волатильность рынка</h3>
        <p>Рынок грузоперевозок США высокодинамичен. Ставки могут резко меняться в течение нескольких часов. Брокеры могут замолчать, отклонить предложения или отменить грузы, которые казались подтверждёнными. Эта непредсказуемость называется <strong>рыночной волатильностью</strong>.</p>
        <p>В таких условиях успех диспетчера определяется не избеганием проблем, а способностью быстро адаптироваться, принимать решения под давлением и находить альтернативы, когда что-то срывается. Устойчивость и нестандартное мышление так же важны, как и навыки переговоров.</p>

        <h3>Рабочий день диспетчера</h3>
        <p>Каждый рабочий день имеет похожую структуру. Он начинается с проверки активных грузов — убедиться, что все текущие рейсы идут по плану, нет задержек, нет проблем. После этого начинается поиск новых грузов на load boards.</p>
        <p>Диспетчер просматривает доступные варианты, определяет выгодные направления и выходит на связь с брокерами. Критически важный навык — умение <strong>вести переговоры о ставке</strong>, это напрямую определяет заработок. После согласования условий диспетчер <strong>бронирует груз</strong> и начинает координировать перевозку.</p>
        <p>В течение дня диспетчер отслеживает движение водителя, делает <strong>check calls</strong> для подтверждения местонахождения и статуса, информирует брокера — в том числе предоставляет <strong>ETA (estimated time of arrival)</strong>. Одновременно он решает возникающие проблемы: неожиданные задержки, перебои в связи или изменения от брокеров в последнюю минуту.</p>

        <h3>Язык профессии</h3>
        <p>Поскольку работа ведётся на рынке США, английский язык является основным языком общения — для звонков брокерам, переговоров по грузам и всей документации. Диспетчер должен уверенно разговаривать по телефону, чётко излагать свою позицию и быстро реагировать в динамичных разговорах.</p>
        <p>Владение профессиональной терминологией — не опция, а базовое требование. Вот аббревиатуры и термины, которые вы будете использовать каждый день:</p>
        <blockquote>
          <strong>PU (Pickup)</strong> — точка, где водитель забирает груз.<br/>
          <strong>DEL (Delivery)</strong> — пункт назначения, куда доставляется груз.<br/>
          <strong>Broker rate</strong> — ставка, которую предлагает брокер за груз.<br/>
          <strong>Carrier pay</strong> — сумма, которую фактически получает перевозчик (и водитель).<br/>
          <strong>Check call</strong> — звонок для подтверждения текущего местоположения водителя и статуса груза. Регулярные check calls — профессиональный стандарт и практическое требование для эффективного диспетчирования.
        </blockquote>

        <h3>Более широкая картина: диспетчер как точка входа в карьеру</h3>
        <p>Для многих людей диспетчирование — это отправная точка для построения карьеры, а со временем и бизнеса в логистике. Оно предлагает относительно быстрый путь к заработку при одновременном накоплении глубоких практических знаний о том, как работает отрасль.</p>
        <p>Со временем этот опыт может привести к управлению флотом, работе с несколькими перевозчиками одновременно или запуску независимого брокерского бизнеса или транспортной компании. Диспетчирование — не просто должностная функция; это фундамент для построения чего-то большего в сфере грузоперевозок.</p>

        <h3>Итог</h3>
        <p>Понимание того, как движутся деньги в системе, какие инструменты используются в повседневной работе, какие типы рынков существуют, что влияет на ценообразование грузов и каких вызовов стоит ожидать — всё это формирует полную, рабочую картину логистики в Америке.</p>
        <p>Цель — не просто механически выполнять задачи. Цель — подходить к этой работе осознанно: принимать информированные решения, постоянно наращивать экспертизу и неуклонно развиваться в настоящего профессионала своей отрасли.</p>
      `,
      quizRu: {
        questions: [
          {
            id: 'q1',
            text: 'Кто инициирует грузоперевозку, имея товары для доставки?',
            options: ['Брокер', 'Перевозчик', 'Грузоотправитель (Shipper)', 'Диспетчер'],
            correctIndex: 2,
          },
          {
            id: 'q2',
            text: 'Кто зарабатывает маржу — разницу между тем, что платит грузоотправитель, и тем, что получает перевозчик?',
            options: ['Диспетчер', 'Водитель', 'Брокер', 'Грузополучатель (Consignee)'],
            correctIndex: 2,
          },
          {
            id: 'q3',
            text: 'Что означает термин "Load" в американских грузоперевозках?',
            options: ['Конкретный маршрут доставки', 'Груз или заявка на перевозку', 'Ставка за перевозку', 'Тип грузовика'],
            correctIndex: 1,
          },
          {
            id: 'q4',
            text: 'Какова основная ежедневная задача диспетчера?',
            options: ['Управлять складскими запасами', 'Искать грузы и вести переговоры о ставках с брокерами', 'Доставлять товары клиентам', 'Оплачивать счета перевозчиков'],
            correctIndex: 1,
          },
          {
            id: 'q5',
            text: 'Что измеряет показатель RPM (Rate per Mile)?',
            options: ['Общую стоимость груза', 'Количество пройденных миль', 'Заработок за милю на конкретном грузе', 'Процент комиссии брокера'],
            correctIndex: 2,
          },
          {
            id: 'q6',
            text: 'Что означает термин "deadhead" в грузоперевозках?',
            options: ['Отменённый груз', 'Езда порожним рейсом без груза', 'Ошибка в документации', 'Перегруженный автомобиль'],
            correctIndex: 1,
          },
          {
            id: 'q7',
            text: 'Что такое "spot market" в грузовой логистике?',
            options: ['Долгосрочный контракт с фиксированными ставками', 'Рынок разовых грузов, где цены меняются в зависимости от спроса и предложения', 'Государственная программа грузоперевозок', 'Платформа с фиксированными тарифами'],
            correctIndex: 1,
          },
          {
            id: 'q8',
            text: 'Что означает аббревиатура "ETA" и почему она важна?',
            options: ['Estimated Total Amount — итоговый счёт', 'Engine Temperature Alert — система безопасности грузовика', 'Estimated Time of Arrival — ожидаемое время прибытия для информирования брокеров', 'Electronic Transfer Authorization — для обработки платежей'],
            correctIndex: 2,
          },
          {
            id: 'q9',
            text: 'Что включает в себя "check call"?',
            options: [
              'Звонок грузоотправителю для подтверждения цены перед бронированием',
              'Звонок для проверки текущего местоположения водителя и статуса груза',
              'Звонок для верификации платежа с перевозчиком',
              'Звонок для оспаривания предложенной брокером ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'q10',
            text: 'Какова роль consignee в цепочке грузоперевозок?',
            options: [
              'Компания, владеющая грузовиками и нанимающая водителей',
              'Посредник, связывающий грузоотправителей и перевозчиков',
              'Сторона, получающая груз в конечном пункте назначения',
              'Непосредственный руководитель диспетчера',
            ],
            correctIndex: 2,
          },
          {
            id: 'q11',
            text: 'Мини-кейс: Брокер предлагает $1 100 за рейс 900 миль. Вы знаете, что средний RPM для этого направления — $1,50. Что делать?',
            options: [
              'Принять немедленно — любой груз лучше, чем порожний рейс',
              'Отказать и молча ждать лучшего предложения',
              'Рассчитать RPM ($1,22/миля) и вести переговоры к рыночной ставке',
              'Спросить водителя — это его расходы на топливо',
            ],
            correctIndex: 2,
          },
          {
            id: 'q12',
            text: 'Мини-кейс: Ваш водитель опаздывает на 2 часа из-за пробок и не успевает к временному окну доставки. Что делаете в первую очередь?',
            options: [
              'Ждёте — может, наверстает на трассе',
              'Немедленно связываетесь с брокером, объясняете ситуацию и сообщаете обновлённый ETA',
              'Отменяете груз, чтобы избежать провала по сервису',
              'Звоните напрямую consignee, не уведомляя брокера',
            ],
            correctIndex: 1,
          },
        ],
      },
      body: `
        <h2>Introduction to US Trucking</h2>
        <p>The US transportation and logistics industry is extremely competitive for all its participants — whether you are a driver, broker, carrier, or owner-operator.</p>
        <p>To succeed in the US transportation and logistics industry, you need to have a high level of communication skills, the ability to adapt to changing business conditions, and a commitment to delivering only top-quality service.</p>
        <p>Nevertheless, the potential for success is high — every year, a huge number of new players enter the transportation services market from one side or another. This reflects the growing role of transportation logistics in the US economy. As a result, this sector continues to expand and attract increasing investment.</p>
        <blockquote>
          <strong>Remember:</strong> This is a HIGHLY COMPETITIVE business at every stage and in every link of the transportation logistics chain — DRIVER, BROKER, CARRIER. This is essential to understand.
        </blockquote>

        <h3>How the System Works</h3>
        <p>Logistics in the United States is one of the key systems underpinning the entire economy. Nearly every product you see in a store, warehouse, or order online moves by truck at some point in its journey.</p>
        <p>This process is called <strong>freight transportation</strong>. The primary method of domestic delivery is <strong>trucking</strong> — moving cargo using large trucks across the country.</p>
        <p>Simply put, logistics is the movement of goods from point A to point B. There's a company with cargo, someone to transport it, and a system connecting the two. The entire industry is built around these interactions — but internally it's far more complex, involving several key roles and processes.</p>

        <h3>The Three Main Players</h3>
        <p>Understanding the market starts with knowing who's involved. In American logistics, there are three primary parties.</p>
        <p>The first is the <strong>shipper</strong> — the company that has goods and needs them delivered. This can be factories, warehouses, distributors, or large e-commerce companies.</p>
        <p>The second is the <strong>broker</strong> — an intermediary who finds a carrier for the load. In most cases, shippers don't work directly with drivers or carriers; they go through brokers instead.</p>
        <p>The third is the <strong>carrier</strong> — the company that owns the trucks and employs the drivers who perform the actual transport.</p>

        <h3>How a Load Moves</h3>
        <p>The process works as follows. A shipper has a shipment that needs to move — this is called a <strong>load</strong>. The broker takes this load and posts it on specialized platforms called <strong>load boards</strong> — websites where available loads are published for carriers and dispatchers to find.</p>
        <p>The dispatcher then enters the picture: they find the load, contact the broker, and negotiate the terms. The driver picks up the freight (called a <strong>pickup</strong>) and delivers it to the destination (<strong>delivery</strong>).</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="18-wheeler semi-truck on US highway" loading="lazy" />
          <figcaption>An 18-wheeler semi-truck — the backbone of US freight transportation, covering millions of miles annually</figcaption>
        </figure>

        <h3>Key Industry Terms</h3>
        <p>Working in logistics means speaking its language. Here are the most important terms you'll encounter every day:</p>
        <blockquote>
          <strong>Load</strong> — the freight or order itself.<br/>
          <strong>Lane</strong> — the route the load travels, e.g., California → Texas.<br/>
          <strong>Rate</strong> — the payment for transporting the load.<br/>
          <strong>RPM (rate per mile)</strong> — the rate per mile, used to evaluate how profitable a load is. For example, if a load pays $2,000 for 1,500 miles, the RPM is approximately $1.33. This metric directly drives decision-making and earnings.
        </blockquote>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="US time zones map" loading="lazy" />
          <figcaption>The four US time zones a dispatcher works with daily — every load appointment must be confirmed in the local time of the pickup or delivery location</figcaption>
        </figure>

        <h3>Roles in the Industry</h3>
        <p>The <strong>driver</strong> physically moves the freight. They pick up the cargo, ensure it's in proper condition, and deliver it to the recipient. Without drivers, the entire system stops.</p>
        <p>The <strong>carrier</strong> is the company that owns the trucks and hires the drivers. This can be a single person — known as an <strong>owner-operator</strong> — or a large fleet company with hundreds of trucks.</p>
        <p>The <strong>dispatcher</strong> is the key role for anyone entering this field. A dispatcher manages the entire transportation operation. They don't drive the truck, but they're responsible for organizing the process: finding loads, communicating with brokers, negotiating rates, planning routes, and monitoring trip execution. In short, the dispatcher is the link between the driver, the broker, and the money.</p>
        <p>The <strong>broker</strong> acts as a middleman. They receive a load from the shipper, find a carrier, and organize the deal. Their earnings come from the difference between what the shipper pays and what the carrier receives — this difference is called the <strong>margin</strong>.</p>
        <p>The <strong>consignee</strong> is the party that receives the freight at the final destination.</p>

        <h3>The Full Chain</h3>
        <p>When you put it all together: the shipper hands the load to the broker → the broker finds a carrier → the dispatcher organizes the transport → the driver delivers the freight → the consignee receives it. At every step there is communication, negotiation, and monitoring.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="US Interstate Highway System" loading="lazy" />
          <figcaption>The US Interstate Highway System — the physical network on which nearly all trucked freight moves across the country</figcaption>
        </figure>

        <h3>The Dispatcher's Daily Work</h3>
        <p>The dispatcher's role is central to this system. Their primary goal is to ensure freight is delivered on time, without problems, and with maximum profit for the company. Daily work covers several key areas.</p>
        <p><strong>Finding loads.</strong> Dispatchers use load boards to locate available orders. When a suitable load is found, they "book a load" — taking it into work.</p>
        <p><strong>Communication with brokers.</strong> The dispatcher calls to confirm details and discuss terms. One of the most critical skills is the ability to <strong>negotiate the rate</strong> — this directly determines income.</p>
        <p><strong>Route planning.</strong> The dispatcher needs to know where the driver is headed, where they'll be after delivery, and what load to pick up next. A key concept here is <strong>deadhead</strong> — empty miles driven without a load. These miles generate no revenue, so minimizing them is a constant priority.</p>

        <h3>During the Trip</h3>
        <p>While the driver is on the road, the dispatcher monitors progress. They track the driver's location, verify they're on schedule, and keep the broker informed. A commonly used term is <strong>ETA (estimated time of arrival)</strong> — the expected arrival time, which matters to every party in the chain.</p>
        <p>Dispatchers also constantly handle unexpected situations: cancelled loads, delays, breakdowns, communication issues with the driver, or difficult broker negotiations. The job demands flexibility, fast reactions, and the ability to make sound decisions under pressure.</p>

        <h3>Earnings and Career Path</h3>
        <p>A dispatcher's income is typically tied to performance. It may be a percentage of each load's value, or a hybrid of fixed pay plus bonuses. The better the loads a dispatcher finds and the more efficient the routes they build, the higher their earnings.</p>
        <p>This role combines several disciplines at once: sales (negotiating prices), analytics (planning routes and selecting loads), constant communication (with brokers and drivers), and stress management (because situations change fast and demand quick responses).</p>
        <p>The reality is that this isn't always easy work. It involves a high volume of calls, frequent rejections, significant responsibility, and rapid decision-making. However, it also offers strong income potential, remote work flexibility, and a clear path toward career growth — even building your own business.</p>

        <h3>What You've Learned</h3>
        <p>Having covered these fundamentals, you now understand how the US freight system is structured, which roles exist, how loads are generated, and how money is made in this industry. The goal at this stage is to build a solid mental model of the process — so that in the following lessons, you can move on to the practical skills and tools of a working dispatcher.</p>

        <h3>How Money Flows in the System</h3>
        <p>Beyond the roles and processes, it's essential to understand how money actually moves through the logistics chain. Every load that gets transported involves a financial transaction. The shipper pays the broker to organize the delivery. The broker then finds a carrier and pays them to execute the run.</p>
        <p>The difference between what the shipper pays the broker and what the broker pays the carrier is the broker's profit — this is called the <strong>margin</strong>.</p>
        <p>The carrier, in turn, pays the driver — or keeps the revenue themselves if they operate as an owner-operator. The dispatcher earns either a percentage of the load's value or a fixed fee per completed run, depending on their agreement. In this way, the entire system is built around moving freight efficiently, and everyone's earnings depend on how well that movement is organized.</p>

        <h3>Tools of the Trade</h3>
        <p>A dispatcher's work is inseparable from the tools they use. The phone is the primary instrument — most communication with brokers happens through calls. Email and digital confirmation are used to lock in agreements and exchange documents.</p>
        <p>As experience grows, dispatchers often work with a <strong>TMS (Transportation Management System)</strong> — software that helps track active loads, plan routes, and manage carrier and broker contacts in one place.</p>

        <h3>Types of Markets</h3>
        <p>In US trucking, there are two main types of freight markets that every dispatcher encounters.</p>
        <p>The first is the <strong>spot market</strong> — one-time loads where the price fluctuates constantly based on current supply and demand. Most beginner dispatchers start here, learning to navigate changing rates and fast-moving negotiations.</p>
        <p>The second type is <strong>contract</strong> or <strong>dedicated</strong> freight — long-term agreements with fixed rates and predictable, steady volumes. These arrangements are more common among large carriers. For most new dispatchers, the spot market is where the bulk of day-to-day work happens.</p>

        <h3>What Determines the Rate</h3>
        <p>The rate for a load — how much it pays — is not fixed. It depends on several key factors.</p>
        <p><strong>Distance (miles)</strong> is the starting point: longer hauls generally pay more in total, though the rate per mile can actually be lower on longer runs. <strong>Lane</strong> matters significantly — certain corridors have high demand and pay well, while others are oversupplied and competitive. <strong>Seasonality</strong> plays a role too, as rates shift throughout the year based on shipping cycles.</p>
        <p>Beyond these, <strong>market conditions</strong> — the balance of available trucks versus available loads — directly drive rates up or down. When loads outnumber trucks, rates rise; when trucks are plentiful, brokers push rates down. Finally, <strong>urgency</strong> is a major factor: a <strong>hot load</strong> is freight that needs to move immediately and typically commands a premium rate — but it also demands fast action and immediate execution from the dispatcher.</p>

        <h3>Market Volatility</h3>
        <p>The US freight market is highly dynamic. Rates can shift sharply within hours. Brokers may go silent, reject offers, or cancel loads that seemed confirmed. This unpredictability is known as <strong>market volatility</strong>.</p>
        <p>In these conditions, a dispatcher's success isn't measured by avoiding problems — it's measured by the ability to adapt quickly, make decisions under pressure, and find alternative options when things fall through. Resilience and creative problem-solving are as important as negotiation skills.</p>

        <h3>A Dispatcher's Daily Workflow</h3>
        <p>Every working day follows a similar structure. It starts with checking active loads — confirming that all current runs are on track, no delays, no issues. Once that's done, the search for new loads begins on load boards.</p>
        <p>The dispatcher reviews available options, identifies profitable lanes, and reaches out to brokers. The critical skill here is the ability to <strong>negotiate the rate</strong> — this directly determines earnings. Once terms are agreed, the dispatcher <strong>books the load</strong> and begins coordinating the transport.</p>
        <p>Throughout the day, the dispatcher monitors the driver's progress, makes <strong>check calls</strong> to confirm location and status, and keeps the broker updated — including providing the <strong>ETA (estimated time of arrival)</strong>. At the same time, they handle any issues that arise: unexpected delays, communication gaps, or last-minute changes from brokers.</p>

        <h3>The Language of the Job</h3>
        <p>Since the work operates in the US market, English is the primary language of communication — for broker calls, load negotiations, and all documentation. A dispatcher needs to speak confidently on the phone, articulate their position clearly, and respond quickly in fast-paced conversations.</p>
        <p>Fluency in professional terminology is not optional — it's a baseline requirement. Here are the abbreviations and terms you'll use every day:</p>
        <blockquote>
          <strong>PU (Pickup)</strong> — the point where the driver picks up the freight.<br/>
          <strong>DEL (Delivery)</strong> — the destination where freight is delivered.<br/>
          <strong>Broker rate</strong> — the rate the broker offers for a load.<br/>
          <strong>Carrier pay</strong> — the amount the carrier (and driver) actually receives.<br/>
          <strong>Check call</strong> — a call made to confirm the driver's current location and load status. Regular check calls are a professional standard and a practical requirement for effective dispatching.
        </blockquote>

        <h3>The Bigger Picture: Dispatcher as a Career Entry Point</h3>
        <p>For many people, dispatching is the starting point for building a career — and eventually a business — in logistics. It offers a relatively fast path to earning income while developing deep practical knowledge of how the industry works.</p>
        <p>Over time, this experience can lead to managing a fleet, working with multiple carriers simultaneously, or launching an independent freight brokerage or trucking company. Dispatching isn't just a job function — it's a foundation for building something larger in the freight industry.</p>

        <h3>Putting It All Together</h3>
        <p>Understanding how money moves through the system, which tools are used day-to-day, what types of markets exist, what drives load pricing, and what challenges to expect — all of this forms a complete, working picture of logistics in America.</p>
        <p>The goal isn't just to complete tasks mechanically. It's to approach this work with intention: making informed decisions, continuously building expertise, and steadily growing into a true professional in the field.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'Who initiates a freight shipment by having goods that need to be transported?',
            options: ['Broker', 'Carrier', 'Shipper', 'Dispatcher'],
            correctIndex: 2,
          },
          {
            id: 'q2',
            text: 'Who earns the margin — the difference between what the shipper pays and what the carrier receives?',
            options: ['Dispatcher', 'Driver', 'Broker', 'Consignee'],
            correctIndex: 2,
          },
          {
            id: 'q3',
            text: 'What does the term "Load" mean in US trucking?',
            options: ['A specific delivery route', 'A freight shipment or order to be transported', 'The rate for transportation', 'A type of truck'],
            correctIndex: 1,
          },
          {
            id: 'q4',
            text: 'What is the dispatcher\'s primary daily task?',
            options: ['Manage warehouse inventory', 'Find loads and negotiate rates with brokers', 'Deliver goods to customers', 'Pay carrier invoices'],
            correctIndex: 1,
          },
          {
            id: 'q5',
            text: 'What does RPM (Rate per Mile) measure?',
            options: ['The total cost of a load', 'The number of miles driven', 'The earnings per mile on a given load', 'The broker\'s commission percentage'],
            correctIndex: 2,
          },
          {
            id: 'q6',
            text: 'What does "deadhead" mean in trucking?',
            options: ['A cancelled load', 'Driving empty miles without freight', 'A documentation error', 'An overweight load'],
            correctIndex: 1,
          },
          {
            id: 'q7',
            text: 'What is the "spot market" in freight logistics?',
            options: ['A long-term freight contract with fixed rates', 'A one-time load market where prices fluctuate with supply and demand', 'A government-regulated shipping program', 'A fixed-rate delivery platform'],
            correctIndex: 1,
          },
          {
            id: 'q8',
            text: 'What does "ETA" stand for and why does it matter?',
            options: ['Estimated Total Amount — the final invoice', 'Engine Temperature Alert — a truck safety system', 'Estimated Time of Arrival — used to keep brokers updated on delivery timing', 'Electronic Transfer Authorization — for payment processing'],
            correctIndex: 2,
          },
          {
            id: 'q9',
            text: 'What does a "check call" involve?',
            options: [
              'A call to a shipper to confirm pricing before booking',
              'A call to verify the driver\'s current location and load status',
              'A payment verification call with the carrier',
              'A call to dispute a broker\'s offered rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'q10',
            text: 'What is the role of a consignee in the freight chain?',
            options: [
              'The company that owns the truck and employs drivers',
              'The intermediary who connects shippers and carriers',
              'The party that receives the freight at the final destination',
              'The dispatcher\'s direct supervisor',
            ],
            correctIndex: 2,
          },
          {
            id: 'q11',
            text: 'Mini-case: A broker offers $1,100 for a 900-mile haul. You know the average RPM for this lane is $1.50. What is the right move?',
            options: [
              'Accept immediately — any load is better than deadhead',
              'Reject it and wait for a better offer without responding',
              'Calculate the RPM ($1.22/mile), then negotiate toward the market rate',
              'Ask the driver to decide since it\'s their fuel cost',
            ],
            correctIndex: 2,
          },
          {
            id: 'q12',
            text: 'Mini-case: Your driver is running 2 hours late due to traffic and will miss the delivery window. What do you do first?',
            options: [
              'Wait and see — maybe they\'ll make up time on the highway',
              'Contact the broker immediately, explain the situation, and provide an updated ETA',
              'Cancel the load to avoid a service failure',
              'Call the consignee directly without notifying the broker',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '1-2': {
      type: 'text',
      body: `
        <h2>How the US Logistics System Really Works</h2>
        <p>The US transportation and logistics system is a complex, dynamic, and highly competitive market in which every link performs its own function — yet depends entirely on the others. The basic model looks simple: freight needs to move from Point A to Point B. In practice, this process involves constant interaction between people, money, time, and risk.</p>
        <blockquote>
          <strong>Key principle:</strong> No participant works in isolation. Every action by one party ripples through the entire chain. If the driver is late — the broker suffers. If the broker gives wrong information — the carrier suffers. If the dispatcher plans the route poorly — everyone loses money.
        </blockquote>

        <h2>Shipper — The Origin of Everything</h2>
        <p>The <strong>shipper</strong> is where the entire system begins. Without them, there are no loads, no revenue, and no reason for anyone else in the chain to work. A shipper is any business that has goods requiring transportation.</p>
        <p><strong>Who shippers are:</strong> manufacturing plants that produce goods, warehouses and distribution centers that process and forward inventory, e-commerce giants like Amazon and Walmart shipping thousands of loads daily, retail chains, and agricultural operations.</p>

        <h3>What the Shipper Does</h3>
        <p><strong>1. Creates the load.</strong> The shipper builds a freight order specifying: type of cargo (electronics, food, auto parts), weight and dimensions in pounds, pickup and delivery locations, and appointment windows — scheduled time slots when the facility is ready to load or receive.</p>
        <p><strong>2. Sets requirements.</strong> The shipper defines the required trailer type (dry van for general cargo, flatbed for oversized equipment, reefer for temperature-sensitive goods), any special handling needs, and the delivery deadline.</p>
        <p><strong>3. Hands the load to a broker.</strong> Most shippers don't manage logistics directly — they outsource operations to freight brokers, pay a flat rate, and expect a result. Their involvement ends at handoff.</p>

        <blockquote>
          <strong>Scenario — A typical shipper situation:</strong><br/>
          A distribution center in Los Angeles has 24 pallets of electronics destined for a warehouse in Dallas. Weight: 22,000 lbs. Trailer: dry van. Delivery deadline: 48 hours. The shipper creates the load, sets a receiving appointment at the Dallas facility, and sends everything to their broker. From that point, they wait for a delivery confirmation — they are not involved in finding the truck, negotiating the rate, or managing the driver.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Pallet jack in warehouse" loading="lazy" />
          <figcaption>A pallet jack at a distribution warehouse — the shipper's facility is where every load originates before a broker or dispatcher touches it</figcaption>
        </figure>

        <h3>Problems Shippers Cause</h3>
        <p><strong>Incorrect weight or dimensions.</strong> The shipper underreports cargo weight. The driver arrives, loads up, and hits a DOT weigh station — the truck is overweight. Fines, delays, and liability disputes follow. The dispatcher must handle the fallout.</p>
        <p><strong>Unrealistic appointment windows.</strong> A 6:00 AM delivery means a midnight departure. This strains HOS (hours of service) limits and creates unnecessary pressure on the driver and dispatcher alike.</p>
        <p><strong>Last-minute load cancellations.</strong> The shipper cancels hours before pickup. The dispatcher must immediately find a replacement load — or the driver deadheads, generating zero revenue.</p>

        <h2>Broker — The Business Connector</h2>
        <p>The <strong>broker</strong> is the intermediary who connects shippers with carriers. They manage freight but own no trucks. Their value is their network, their market knowledge, and their ability to execute deals at scale.</p>

        <h3>What the Broker Does</h3>
        <p><strong>1. Posts the load.</strong> The broker receives the load from the shipper and publishes it on load boards — digital freight marketplaces where carriers and dispatchers search for available work. The two dominant platforms in the US are <strong>DAT</strong> (the largest) and <strong>Truckstop (ITS)</strong>. Brokers also call known carriers directly when they need coverage fast.</p>
        <p><strong>2. Manages the rate.</strong> The broker sets an opening price and negotiates with dispatchers. Their goal: move the freight at the lowest possible carrier cost to maximize their own margin.</p>
        <p><strong>3. Monitors the load.</strong> Once a carrier is booked, the broker tracks shipment progress, communicates with the dispatcher on ETA, and keeps the shipper informed.</p>
        <p><strong>4. Manages documentation.</strong> The broker issues the <strong>rate confirmation (rate con)</strong> — a binding written agreement specifying the load details and the agreed rate. Both parties sign before the truck moves. After delivery, the broker handles invoicing and payment.</p>

        <blockquote>
          <strong>The broker's economics:</strong><br/>
          Shipper pays broker: <strong>$3,000</strong><br/>
          Carrier receives: <strong>$2,400</strong><br/>
          Broker margin: <strong>$600 (20%)</strong><br/>
          The dispatcher's job is to push this margin down — negotiating a higher carrier pay — while the broker's job is to keep it as wide as possible.
        </blockquote>

        <blockquote>
          <strong>Scenario — Negotiation in action:</strong><br/>
          A broker posts a load: California → Texas, offering $2,200. A dispatcher calls:<br/>
          <em>"Hey, this is [Carrier] on the Dallas load. We can cover it today — truck is in Fresno, ready to roll. I need $2,500 to make it work."</em><br/>
          Broker: <em>"Best I can do is $2,350."</em><br/>
          Dispatcher: <em>"Done. Send the rate con."</em><br/>
          This back-and-forth is the core of daily dispatching work.
        </blockquote>

        <h3>Problems with Brokers</h3>
        <p><strong>Low-balling.</strong> The broker consistently offers rates well below market value. The dispatcher must recognize this, counter confidently, and walk away if necessary. Accepting bad rates directly damages carrier revenue over time.</p>
        <p><strong>Double booking.</strong> The broker gives the same load to multiple carriers simultaneously, creating a race to confirm first. The losing carrier wastes time and loses planned miles — a frustrating and common tactic.</p>
        <p><strong>Rate renegotiation after the rate con is signed.</strong> Market conditions shift and the broker calls to lower the agreed rate. This is a critical moment: a signed rate con is a legal document. The dispatcher must hold the rate firmly and professionally.</p>
        <p><strong>Broker going silent.</strong> The broker stops responding mid-shipment. The dispatcher stays proactive — calling, emailing, and keeping the shipper updated regardless.</p>

        <h2>Carrier — The Business of Movement</h2>
        <p>The <strong>carrier</strong> is the company that owns the trucks and employs the drivers. Their business model: move freight, earn revenue, cover costs, keep the profit. They are the ones who make physical transportation possible.</p>

        <h3>What the Carrier Does</h3>
        <p><strong>1. Provides the equipment.</strong> The carrier owns and maintains the truck (power unit) and trailer. Trailer type determines what freight they can haul — dry vans for general cargo, flatbeds for machinery, reefers for food and pharmaceuticals.</p>
        <p><strong>2. Assigns a driver.</strong> The carrier must verify the driver's CDL status, current HOS availability, and location before committing to a load.</p>
        <p><strong>3. Manages operations through the dispatcher.</strong> Most carriers — even solo owner-operators — work with a dispatcher who handles load finding, rate negotiation, and logistics coordination. The dispatcher is the carrier's revenue engine.</p>

        <blockquote>
          <strong>Carrier cost structure — real example:</strong><br/>
          Load revenue: <strong>$2,400</strong> (1,200 miles, CA → TX)<br/>
          Fuel: <strong>$720</strong> (~$0.60/mile)<br/>
          Driver pay: <strong>$480</strong> (~$0.40/mile)<br/>
          Insurance, maintenance, misc: <strong>$300</strong><br/>
          Net profit: <strong>~$900 per load</strong><br/>
          Every dollar negotiated above $2,400 goes directly to the bottom line. This is why rate negotiation matters.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Semi-truck on the highway" loading="lazy" />
          <figcaption>A semi-truck on the highway — the carrier's most valuable asset and the source of every dollar in the system</figcaption>
        </figure>

        <h3>Types of Carriers</h3>
        <p><strong>Owner-operator</strong> — A single driver who owns their truck and runs their own business. Maximum freedom, maximum responsibility. They benefit most from a skilled dispatcher who keeps them loaded without spending hours on hold with brokers.</p>
        <p><strong>Small fleet (2–10 trucks)</strong> — A small business with several trucks, usually managed by an owner who also dispatches, or by a contracted dispatcher.</p>
        <p><strong>Large fleet (50–500+ trucks)</strong> — Corporate carriers with in-house dispatch departments, dedicated contract lanes, and structured operations.</p>

        <blockquote>
          <strong>Scenario — Dispatcher protecting carrier revenue:</strong><br/>
          An owner-operator finishes a delivery in Dallas. The truck is empty — deadhead risk is high. The dispatcher immediately calls three brokers and searches DAT for northbound loads out of Dallas. They find a load to Chicago for $2,800 over 925 miles ($3.03 RPM). After costs, the driver nets approximately $1,100 on this run. Without proactive dispatching, the driver might wait hours or deadhead to a better market — losing money every mile.
        </blockquote>

        <h3>Problems for Carriers</h3>
        <p><strong>Truck breakdown mid-trip.</strong> A mechanical failure on the road means the load is at risk. The dispatcher notifies the broker immediately, explores replacement options, and manages timeline expectations — all while the driver is stranded.</p>
        <p><strong>Getting stuck in a weak freight market.</strong> Some regions have too many trucks and not enough outbound freight. Smart dispatchers plan delivery destinations with an eye on the next load — never driving blindly into a market with no exit.</p>

        <h2>Dispatcher — The Center of the System</h2>
        <p>The <strong>dispatcher</strong> is the operational core of the logistics chain. They don't drive the truck, own the freight, or set shipper prices — but they control the decisions that determine whether everyone gets paid. The dispatcher is the link between the driver, the broker, and the money.</p>

        <h3>Core Responsibilities</h3>
        <p><strong>1. Load search and evaluation.</strong> A dispatcher doesn't just find any load — they find the right one. The key evaluation criteria: RPM (must exceed operational costs), lane direction (where does this delivery position the driver?), trailer compatibility, and pickup/delivery timing relative to the driver's HOS.</p>
        <p><strong>2. Negotiation.</strong> The dispatcher is a professional negotiator. They never accept the first price without countering:</p>
        <blockquote>
          <em>"I see you have a load going to Atlanta. We can cover it — but I need $2.20 per mile on this lane. Coming out of Atlanta is tough and I need to make it worth our while. What can you do?"</em><br/><br/>
          Key principles: know the market rate before calling, offer value (available now, reliable carrier, clean safety record), always counter the book rate, and know when to walk away.
        </blockquote>
        <p><strong>3. Route planning and deadhead minimization.</strong> Every deadhead mile costs money with zero revenue. The dispatcher thinks multiple moves ahead: where does this load deliver? What's the freight market in that city? Can a backhaul (return load) be pre-booked before the driver arrives?</p>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Truck liftgate at delivery" loading="lazy" />
          <figcaption>A truck liftgate in action — understanding equipment capabilities like this directly affects which loads a dispatcher can book and at what rate</figcaption>
        </figure>

        <p><strong>4. Active trip monitoring.</strong> While the driver is on the road, the dispatcher makes regular <strong>check calls</strong> to confirm location and status, tracks ETA, keeps the broker updated, and manages any issues that arise en route.</p>
        <p><strong>5. Problem solving under pressure.</strong> Unexpected situations are not exceptions — they are part of every working day. How the dispatcher responds determines profitability.</p>

        <blockquote>
          <strong>Scenario — Cancelled load, real response:</strong><br/>
          A driver is 400 miles into a CA → TX run. The broker calls: the consignee rejected the appointment. Load cancelled.<br/>
          Dispatcher's response:<br/>
          1. Confirms the cancellation in writing with the broker — asks about compensation for miles already driven.<br/>
          2. Immediately pulls up DAT and Truckstop — searches for loads near the driver's current position in New Mexico.<br/>
          3. Finds a load NM → TX for $1,800 — not ideal, but it covers the driver's position and avoids a full deadhead.<br/>
          4. Books it, sends updated instructions to the driver.<br/>
          Time from problem to resolution: under 20 minutes.
        </blockquote>

        <h3>Critical Daily Challenges</h3>
        <p><strong>No outbound freight at the destination.</strong> The dispatcher must pre-plan before the driver arrives — never let the truck sit idle waiting for a load to appear.</p>
        <p><strong>Rate drop after signing.</strong> A broker calls back trying to lower an agreed rate. The signed rate con is legally binding. The dispatcher holds the rate and documents everything.</p>
        <p><strong>Driver communication issues.</strong> The driver stops responding. The dispatcher must locate them, understand the situation, and manage the broker relationship simultaneously.</p>

        <h2>Driver — The Execution Point</h2>
        <p>The <strong>driver</strong> is the person who turns all the planning into reality. Every strategy the dispatcher builds exists solely to keep this person moving profitably and legally.</p>

        <h3>Core Responsibilities</h3>
        <p><strong>Pickup (PU).</strong> The driver arrives at the shipper's facility, checks in, waits for loading, inspects the cargo, and signs the <strong>BOL (Bill of Lading)</strong> — the legal document confirming exactly what was loaded, its condition, and where it's going.</p>
        <p><strong>Transport.</strong> The driver operates the truck safely, follows the planned route, and maintains communication with the dispatcher throughout the run. Any delays, route issues, or unexpected stops must be reported immediately.</p>
        <p><strong>Delivery (DEL).</strong> The driver arrives at the consignee, oversees unloading, collects the signed <strong>POD (Proof of Delivery)</strong> — confirming the freight arrived in acceptable condition — and reports completion to the dispatcher.</p>

        <h3>HOS — Hours of Service</h3>
        <p>Federal law strictly limits driver operating time. Key rules: maximum 11 hours of driving per day, mandatory 10-hour rest break before driving again, and a 70-hour limit on on-duty time within any 8-day rolling period.</p>

        <blockquote>
          <strong>Why HOS shapes every dispatcher decision:</strong><br/>
          A driver with only 4 hours of available drive time cannot legally accept a 6-hour load. The dispatcher must track each driver's HOS at all times to avoid booking runs the driver cannot complete — which would result in a service failure, a damaged broker relationship, and potential DOT violations.
        </blockquote>

        <blockquote>
          <strong>Scenario — HOS planning in practice:</strong><br/>
          Driver is in Memphis with 5 hours available. The dispatcher finds a load to Nashville — 3.5 hours away. It fits. After delivery, the driver will need a 10-hour reset. The dispatcher pre-searches loads out of Nashville for the following morning so zero time is wasted after the break. This is proactive dispatching — always thinking one step ahead.
        </blockquote>

        <h3>Driver Challenges the Dispatcher Must Manage</h3>
        <p><strong>Detention.</strong> The driver arrives on time but the facility keeps them waiting for hours. Every hour beyond the free time limit (typically 2 hours) is called <strong>detention</strong> and should be compensated. The dispatcher documents arrival times and pushes the broker for detention pay.</p>
        <p><strong>Weigh station issues.</strong> The truck is pulled over at a DOT scale and found overweight due to incorrect shipper weight data. The dispatcher must communicate immediately with the broker and document the shipper's liability.</p>
        <p><strong>Driver personal issues.</strong> A driver calls in sick or refuses a load for personal reasons. The dispatcher must solve this without losing the booked freight — finding a replacement or negotiating with the broker for a later pickup.</p>

        <h2>Consignee — The Final Link</h2>
        <p>The <strong>consignee</strong> is the receiver of the freight — the business or facility at the delivery destination. They are the final step before payment is triggered for everyone in the chain.</p>
        <p>The consignee schedules and manages delivery appointments, receives and inspects the cargo, signs the POD confirming the freight arrived in acceptable condition, and reports any damage or discrepancy in writing.</p>

        <blockquote>
          <strong>Why the consignee affects the dispatcher:</strong><br/>
          A consignee running behind schedule causes detention for the driver — time and money. If the consignee refuses the freight (damaged goods, wrong items, missing documentation), a freight claim is opened. The dispatcher must manage the fallout with both the broker and the carrier while protecting the driver from liability.
        </blockquote>

        <h2>Full Scenario: How It All Works Together</h2>
        <blockquote>
          <strong>A real run — Los Angeles to Dallas:</strong><br/><br/>
          <strong>Monday 6:00 AM</strong> — Shipper in Los Angeles creates a load: 20,000 lbs of auto parts, LAX area → Dallas. Deadline: Wednesday morning. Sends to broker.<br/><br/>
          <strong>Monday 8:30 AM</strong> — Broker posts on DAT: $2,100. Starts calling known carriers.<br/><br/>
          <strong>Monday 9:00 AM</strong> — Dispatcher spots the load. Driver is available in Fresno, 3 hours from LA. Dallas has decent outbound freight. RPM: $2,100 ÷ 1,500 miles = $1.40 — below target. Calls the broker: <em>"We can cover this today. I need $2,400 to make it work."</em> Broker counters: <em>"Best I can do is $2,250."</em> Dispatcher: <em>"Done. Send the rate con."</em><br/><br/>
          <strong>Monday 9:20 AM</strong> — Rate con signed. Driver gets pickup details. Heads toward LA.<br/><br/>
          <strong>Monday 2:00 PM</strong> — Driver arrives at shipper. Waits 2.5 hours for loading (detention clock starts after hour 1). Dispatcher documents arrival time, prepares detention request.<br/><br/>
          <strong>Monday 4:30 PM</strong> — Driver loaded, BOL signed. Trip starts. ~1,500 miles to Dallas.<br/><br/>
          <strong>Tuesday, all day</strong> — Dispatcher makes check calls every 4–6 hours. Updates broker on ETA. Simultaneously searches for a Dallas outbound load for Wednesday — already finds a promising run to Chicago at $2,600.<br/><br/>
          <strong>Wednesday 7:00 AM</strong> — Driver arrives in Dallas. Consignee receives, inspects, signs POD. Delivery confirmed.<br/><br/>
          <strong>Wednesday 7:15 AM</strong> — Dispatcher reports completion to broker. Invoice submitted. Dallas → Chicago load already confirmed for Thursday. Zero deadhead.
        </blockquote>

        <h2>The Bigger Picture</h2>
        <p>Every load that moves successfully is the result of coordinated action by all six participants. When one link breaks, the whole chain feels it. The dispatcher's advantage is deep awareness — understanding each role well enough to anticipate problems, fill gaps, and make decisions that protect the carrier's revenue while building trusted relationships with brokers over time.</p>
        <blockquote>
          <strong>The difference between an average dispatcher and a great one:</strong><br/>
          An average dispatcher reacts to problems.<br/>
          A great dispatcher anticipates them — and already has a plan before they happen.
        </blockquote>
      `,
      bodyRu: `
        <h2>Как реально работает логистическая система США</h2>
        <p>Транспортно-логистическая система США — это сложный, динамичный и высококонкурентный рынок, где каждое звено выполняет свою функцию, но при этом напрямую зависит от всех остальных. Базовая модель выглядит просто: груз нужно перевезти из точки А в точку Б. На практике за этим процессом стоит постоянное взаимодействие людей, денег, времени и рисков.</p>
        <blockquote>
          <strong>Ключевой принцип:</strong> Ни один участник не работает изолированно. Любое действие одного звена влияет на всю цепочку. Если водитель опоздал — страдает брокер. Если брокер дал неверную информацию — страдает перевозчик. Если диспетчер неправильно спланировал маршрут — все теряют деньги.
        </blockquote>

        <h2>Shipper (Грузоотправитель) — Начало всего</h2>
        <p><strong>Shipper</strong> — это точка старта всей системы. Без него нет грузов, нет выручки и нет смысла существования для остальных участников цепочки. Shipper — это любой бизнес, у которого есть товар, требующий транспортировки.</p>
        <p><strong>Кто такие shippers:</strong> производственные предприятия, склады и распределительные центры, e-commerce гиганты вроде Amazon и Walmart, отправляющие тысячи грузов ежедневно, розничные сети и сельскохозяйственные компании.</p>

        <h3>Что делает Shipper</h3>
        <p><strong>1. Создаёт груз (load).</strong> Shipper формирует заявку на перевозку: тип груза (электроника, продукты, автозапчасти), вес и габариты, адреса pickup и delivery, а также appointment windows — временные окна, когда склад готов отгружать или принимать.</p>
        <p><strong>2. Устанавливает требования.</strong> Shipper задаёт тип прицепа (dry van для обычных грузов, flatbed для негабарита, reefer для температурных грузов), особые условия обращения с грузом и дедлайн доставки.</p>
        <p><strong>3. Передаёт груз брокеру.</strong> Большинство shippers не занимаются логистикой напрямую — они аутсорсят операционку брокерам, платят фиксированную ставку и ждут результата. На этом их участие заканчивается.</p>

        <blockquote>
          <strong>Сценарий — Типичная ситуация Shipper'а:</strong><br/>
          Распределительный центр в Лос-Анджелесе отправляет 24 паллеты электроники на склад в Далласе. Вес: 22 000 lbs. Прицеп: dry van. Срок: 48 часов. Shipper создаёт груз, устанавливает appointment на складе в Далласе и передаёт всё брокеру. Дальше он просто ждёт подтверждения доставки — поиск грузовика, переговоры о ставке и работа с водителем его не касаются.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Рохля на распределительном складе" loading="lazy" />
          <figcaption>Рохля на распределительном складе — именно здесь, у грузоотправителя, начинается каждый груз ещё до того, как брокер или диспетчер получают к нему доступ</figcaption>
        </figure>

        <h3>Проблемы, которые создаёт Shipper</h3>
        <p><strong>Неправильный вес или габариты.</strong> Shipper занижает вес груза. Водитель загружается, едет к весовой станции DOT — перегруз. Штрафы, задержки, споры об ответственности. Диспетчер разбирается с последствиями.</p>
        <p><strong>Нереалистичные временные окна.</strong> Доставка в 6:00 утра означает выезд в полночь. Это давит на лимиты HOS и создаёт ненужный стресс для водителя и диспетчера.</p>
        <p><strong>Отмена в последний момент.</strong> Shipper отменяет груз за несколько часов до pickup. Диспетчер срочно ищет замену — иначе водитель едет порожним (deadhead) и не зарабатывает ни цента.</p>

        <h2>Broker (Брокер) — Связующее звено бизнеса</h2>
        <p><strong>Брокер</strong> — посредник, соединяющий shippers с carriers. Он управляет грузом, но не владеет транспортом. Его ценность — это сеть контактов, знание рынка и умение закрывать сделки в больших объёмах.</p>

        <h3>Что делает Broker</h3>
        <p><strong>1. Размещает груз.</strong> Брокер получает груз от shipper'а и публикует его на load boards — цифровых биржах грузов, где carriers и диспетчеры ищут доступные заявки. Две главные платформы в США: <strong>DAT</strong> (крупнейшая) и <strong>Truckstop (ITS)</strong>. При необходимости брокеры также звонят напрямую знакомым перевозчикам.</p>
        <p><strong>2. Управляет ставкой.</strong> Брокер выставляет начальную цену и ведёт переговоры с диспетчерами. Его цель — перевезти груз с минимальными затратами на перевозчика, чтобы максимизировать собственную маржу.</p>
        <p><strong>3. Мониторит груз.</strong> После бронирования брокер отслеживает ход перевозки, общается с диспетчером по ETA и информирует shipper'а.</p>
        <p><strong>4. Ведёт документооборот.</strong> Брокер оформляет <strong>rate confirmation (rate con)</strong> — обязывающий письменный документ с деталями груза и согласованной ставкой. Обе стороны подписывают до начала перевозки. После доставки брокер выставляет счёт и проводит оплату.</p>

        <blockquote>
          <strong>Экономика брокера — реальные цифры:</strong><br/>
          Shipper платит брокеру: <strong>$3 000</strong><br/>
          Carrier получает: <strong>$2 400</strong><br/>
          Маржа брокера: <strong>$600 (20%)</strong><br/>
          Задача диспетчера — «съесть» эту маржу, выторговав более высокую ставку для carrier'а. Задача брокера — удержать её как можно шире.
        </blockquote>

        <blockquote>
          <strong>Сценарий — Переговоры в действии:</strong><br/>
          Брокер выставляет груз: California → Texas, $2 200. Диспетчер звонит:<br/>
          <em>"Привет, это [Carrier] по грузу в Даллас. Можем закрыть сегодня — машина во Фресно, готова прямо сейчас. Мне нужно $2 500, чтобы это имело смысл."</em><br/>
          Брокер: <em>"Лучшее, что могу — $2 350."</em><br/>
          Диспетчер: <em>"Окей. Скидывай rate con."</em><br/>
          Этот диалог — суть ежедневной работы диспетчера.
        </blockquote>

        <h3>Проблемы с брокерами</h3>
        <p><strong>Low-balling (заниженные ставки).</strong> Брокер систематически предлагает ставки ниже рынка. Диспетчер должен это замечать, уверенно торговаться и уходить при необходимости. Принятие плохих ставок напрямую убивает выручку carrier'а.</p>
        <p><strong>Double booking.</strong> Брокер отдаёт один груз сразу нескольким carrier'ам, создавая гонку за подтверждением. Проигравший теряет время и запланированные мили.</p>
        <p><strong>Renegotiation после подписания rate con.</strong> Ситуация на рынке изменилась, брокер звонит и просит снизить уже согласованную ставку. Подписанный rate con — юридический документ. Диспетчер держит позицию твёрдо и профессионально.</p>
        <p><strong>Брокер перестаёт отвечать.</strong> Груз уже в пути, а брокер молчит. Диспетчер остаётся проактивным — звонит, пишет письма, держит shipper'а в курсе.</p>

        <h2>Carrier (Перевозчик) — Бизнес на движении</h2>
        <p><strong>Carrier</strong> — компания, владеющая грузовиками и нанимающая водителей. Их бизнес-модель проста: перевозить грузы, получать выручку, покрывать расходы, удерживать прибыль. Именно они делают физическую перевозку возможной.</p>

        <h3>Что делает Carrier</h3>
        <p><strong>1. Предоставляет технику.</strong> Carrier владеет и обслуживает грузовик (power unit) и прицеп. Тип прицепа определяет, какие грузы carrier может перевозить: dry van для обычных грузов, flatbed для негабаритного оборудования, reefer для продуктов и фармацевтики.</p>
        <p><strong>2. Назначает водителя.</strong> Carrier проверяет статус CDL водителя, его текущий остаток HOS и местонахождение перед тем, как принять груз.</p>
        <p><strong>3. Управляет операциями через диспетчера.</strong> Большинство carriers — даже одиночные owner-operators — работают с диспетчером, который занимается поиском грузов, переговорами о ставках и координацией логистики. Диспетчер — это двигатель выручки carrier'а.</p>

        <blockquote>
          <strong>Структура затрат carrier'а — реальный пример:</strong><br/>
          Выручка за рейс: <strong>$2 400</strong> (1 200 миль, CA → TX)<br/>
          Топливо: <strong>$720</strong> (~$0,60/миля)<br/>
          Оплата водителя: <strong>$480</strong> (~$0,40/миля)<br/>
          Страховка, техобслуживание и прочее: <strong>$300</strong><br/>
          Чистая прибыль: <strong>~$900 за рейс</strong><br/>
          Каждый доллар, выторгованный сверх $2 400, идёт напрямую в прибыль. Именно поэтому переговоры о ставке так важны.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Магистральный грузовик на шоссе" loading="lazy" />
          <figcaption>Магистральный тягач на трассе — главный актив carrier'а и источник каждого доллара в логистической цепочке</figcaption>
        </figure>

        <h3>Типы Carriers</h3>
        <p><strong>Owner-operator</strong> — одиночный водитель, владеющий своим грузовиком и ведущий собственный бизнес. Максимум свободы, максимум ответственности. Больше всех выигрывает от сильного диспетчера, который держит его загруженным без часов переговоров по телефону.</p>
        <p><strong>Small fleet (2–10 машин)</strong> — небольшой бизнес с несколькими грузовиками, которым управляет владелец или нанятый диспетчер.</p>
        <p><strong>Large fleet (50–500+ машин)</strong> — корпоративные carriers со своими отделами диспетчеризации, выделенными контрактными направлениями и структурированными операциями.</p>

        <blockquote>
          <strong>Сценарий — Диспетчер защищает выручку carrier'а:</strong><br/>
          Owner-operator сдал груз в Далласе. Машина пустая — риск deadhead. Диспетчер немедленно звонит трём брокерам и ищет северные грузы из Далласа на DAT. Находит рейс в Чикаго: $2 800 за 925 миль ($3,03 RPM). После расходов водитель зарабатывает около $1 100 на этом рейсе. Без проактивной диспетчеризации водитель мог бы простоять часы в ожидании — теряя деньги каждую минуту.
        </blockquote>

        <h2>Dispatcher (Диспетчер) — Центр всей системы</h2>
        <p><strong>Диспетчер</strong> — операционное ядро логистической цепочки. Он не ведёт грузовик, не владеет грузом и не устанавливает цены shipper'а — но именно он принимает решения, от которых зависит, получат ли все остальные свои деньги. Диспетчер — связующее звено между водителем, брокером и деньгами.</p>

        <h3>Ключевые обязанности</h3>
        <p><strong>1. Поиск и оценка грузов.</strong> Диспетчер ищет не любой груз, а правильный. Ключевые критерии: RPM (должен покрывать операционные расходы), направление рейса (куда он ставит водителя?), совместимость с прицепом и соответствие pickup/delivery лимитам HOS водителя.</p>
        <p><strong>2. Переговоры.</strong> Диспетчер — профессиональный переговорщик. Он никогда не принимает первую цену без контрпредложения:</p>
        <blockquote>
          <em>"Вижу у тебя груз в Атланту. Можем закрыть — но мне нужно $2,20 за милю на этом направлении. Выезд из Атланты сложный, нужно это компенсировать. Что можешь сделать?"</em><br/><br/>
          Принципы: знать рыночную ставку до звонка, предлагать ценность (доступен сейчас, надёжный carrier, чистая история), всегда делать контрпредложение и знать, когда уходить.
        </blockquote>
        <p><strong>3. Планирование маршрута и минимизация deadhead.</strong> Каждая порожняя миля стоит денег при нулевой выручке. Диспетчер думает на несколько ходов вперёд: куда доставляется этот груз? Каков рынок грузов в городе назначения? Можно ли забронировать backhaul (обратный груз) заранее, до прибытия водителя?</p>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Лифтгейт грузовика на доставке" loading="lazy" />
          <figcaption>Лифтгейт в работе — понимание возможностей оборудования напрямую влияет на то, какие грузы может взять диспетчер и по какой ставке</figcaption>
        </figure>

        <p><strong>4. Активный мониторинг рейса.</strong> Пока водитель в пути, диспетчер делает регулярные <strong>check calls</strong> — звонки для подтверждения местоположения и статуса, отслеживает ETA, информирует брокера и решает возникающие проблемы.</p>
        <p><strong>5. Решение проблем под давлением.</strong> Внештатные ситуации — не исключение, а норма каждого рабочего дня. То, как диспетчер реагирует на них, определяет прибыльность.</p>

        <blockquote>
          <strong>Сценарий — Отменённый груз: реальный ответ диспетчера:</strong><br/>
          Водитель в 400 милях от старта рейса CA → TX. Звонит брокер: грузополучатель отклонил appointment. Груз отменён.<br/>
          Действия диспетчера:<br/>
          1. Подтверждает отмену письменно, уточняет компенсацию за уже пройденные мили.<br/>
          2. Открывает DAT и Truckstop — ищет грузы рядом с текущим положением водителя в Нью-Мексико.<br/>
          3. Находит рейс NM → TX за $1 800 — не идеально, но покрывает позицию и избегает полного deadhead.<br/>
          4. Бронирует, отправляет водителю обновлённые инструкции.<br/>
          Время от проблемы до решения: меньше 20 минут.
        </blockquote>

        <h2>Driver (Водитель) — Точка исполнения</h2>
        <p><strong>Водитель</strong> — человек, превращающий планирование в реальность. Каждая стратегия, которую строит диспетчер, существует только для того, чтобы этот человек двигался прибыльно и в рамках закона.</p>

        <h3>Ключевые обязанности</h3>
        <p><strong>Pickup (PU).</strong> Водитель приезжает на объект shipper'а, проходит check-in, ждёт погрузки, проверяет груз и подписывает <strong>BOL (Bill of Lading)</strong> — юридический документ, подтверждающий, что именно было загружено, в каком состоянии и куда направляется.</p>
        <p><strong>Перевозка.</strong> Водитель безопасно управляет грузовиком, следует плановому маршруту и поддерживает связь с диспетчером на протяжении всего рейса. О любых задержках, проблемах на дороге или незапланированных остановках нужно сообщать немедленно.</p>
        <p><strong>Delivery (DEL).</strong> Водитель прибывает к грузополучателю, присутствует при разгрузке, получает подписанный <strong>POD (Proof of Delivery)</strong> — подтверждение, что груз принят в надлежащем состоянии — и сообщает диспетчеру о завершении рейса.</p>

        <h3>HOS — Hours of Service</h3>
        <p>Федеральный закон строго ограничивает рабочее время водителей. Ключевые правила: максимум 11 часов вождения в сутки, обязательный отдых 10 часов до следующей смены, 70 часов on-duty за любые 8 дней подряд.</p>

        <blockquote>
          <strong>Почему HOS определяет каждое решение диспетчера:</strong><br/>
          Водитель с остатком 4 часа не может юридически принять рейс длиной 6 часов. Диспетчер обязан постоянно отслеживать HOS каждого водителя, чтобы не бронировать рейсы, которые тот не сможет завершить — это ведёт к срыву доставки, потере отношений с брокером и возможным нарушениям DOT.
        </blockquote>

        <blockquote>
          <strong>Сценарий — Планирование с учётом HOS:</strong><br/>
          Водитель в Мемфисе, доступно 5 часов вождения. Диспетчер находит груз до Нэшвилла — 3,5 часа. Подходит. После доставки водителю нужен 10-часовой отдых. Диспетчер заранее ищет грузы из Нэшвилла на следующее утро — ни одной потерянной минуты после reset'а. Это и есть проактивная диспетчеризация.
        </blockquote>

        <h3>Проблемы водителя, которые решает диспетчер</h3>
        <p><strong>Detention (время ожидания).</strong> Водитель приехал вовремя, но склад держит его часами. Каждый час сверх бесплатного лимита (обычно 2 часа) — это detention, который должен быть компенсирован. Диспетчер фиксирует время прибытия и требует от брокера detention pay.</p>
        <p><strong>Проблемы на весовой станции.</strong> Грузовик останавливают на DOT scale — перегруз из-за неверных данных shipper'а. Диспетчер немедленно связывается с брокером и документирует ответственность shipper'а.</p>
        <p><strong>Личные обстоятельства водителя.</strong> Водитель заболел или отказывается от рейса. Диспетчер должен решить ситуацию без потери уже забронированного груза.</p>

        <h2>Consignee (Грузополучатель) — Финальное звено</h2>
        <p><strong>Consignee</strong> — получатель груза, финальная точка доставки. Именно после его подписи запускается процесс оплаты для всей цепочки.</p>
        <p>Consignee планирует и управляет appointment'ами на приёмку, получает и проверяет груз, подписывает POD (подтверждение доставки в надлежащем состоянии), фиксирует любые повреждения или несоответствия письменно.</p>

        <blockquote>
          <strong>Почему consignee важен для диспетчера:</strong><br/>
          Consignee, выбивающийся из графика, накапливает detention водителю — время и деньги. Если consignee отказывается принять груз (повреждения, не тот товар, проблемы с документами), открывается freight claim. Диспетчер управляет последствиями одновременно для брокера и carrier'а, защищая водителя от ответственности.
        </blockquote>

        <h2>Как всё работает вместе — Полный сценарий</h2>
        <blockquote>
          <strong>Реальный рейс — Лос-Анджелес → Даллас:</strong><br/><br/>
          <strong>Понедельник, 6:00</strong> — Shipper в Лос-Анджелесе создаёт груз: 20 000 lbs автозапчастей, район LAX → Даллас. Дедлайн: среда утром. Передаёт брокеру.<br/><br/>
          <strong>Понедельник, 8:30</strong> — Брокер размещает на DAT: $2 100. Начинает обзванивать carriers.<br/><br/>
          <strong>Понедельник, 9:00</strong> — Диспетчер замечает груз. Водитель свободен во Фресно, 3 часа от LA. Даллас — рынок с хорошими исходящими грузами. RPM: $2 100 ÷ 1 500 миль = $1,40 — ниже нормы. Звонит брокеру: <em>"Можем закрыть сегодня. Мне нужно $2 400."</em> Брокер: <em>"Лучшее — $2 250."</em> Диспетчер: <em>"Договорились. Rate con."</em><br/><br/>
          <strong>Понедельник, 9:20</strong> — Rate con подписан. Водитель получает детали pickup. Выезжает в LA.<br/><br/>
          <strong>Понедельник, 14:00</strong> — Водитель на складе. Ждёт погрузку 2,5 часа (detention clock запустился через час). Диспетчер фиксирует время прибытия, готовит запрос на detention pay.<br/><br/>
          <strong>Понедельник, 16:30</strong> — Погрузка завершена, BOL подписан. Рейс начался. ~1 500 миль до Далласа.<br/><br/>
          <strong>Вторник, весь день</strong> — Диспетчер делает check calls каждые 4–6 часов. Обновляет брокера по ETA. Параллельно ищет исходящий груз из Далласа на среду — уже находит перспективный рейс в Чикаго за $2 600.<br/><br/>
          <strong>Среда, 7:00</strong> — Водитель в Далласе. Consignee принимает, проверяет, подписывает POD. Доставка подтверждена.<br/><br/>
          <strong>Среда, 7:15</strong> — Диспетчер докладывает брокеру о завершении. Счёт выставлен. Груз Даллас → Чикаго уже подтверждён на четверг. Нулевой deadhead.
        </blockquote>

        <h2>Главный вывод</h2>
        <p>Каждый успешно доставленный груз — это результат скоординированных действий всех шести участников. Когда одно звено ломается — вся цепочка это чувствует. Преимущество диспетчера — в глубоком понимании каждой роли: достаточном, чтобы предвидеть проблемы, закрывать пробелы и принимать решения, защищающие выручку carrier'а, одновременно выстраивая доверительные отношения с брокерами.</p>
        <blockquote>
          <strong>Разница между средним и сильным диспетчером:</strong><br/>
          Средний диспетчер реагирует на проблемы.<br/>
          Сильный — предвидит их и уже имеет план до того, как они возникли.
        </blockquote>
      `,
      quiz: {
        questions: [
          {
            id: 'th-q1',
            text: 'What is the primary role of a shipper in the US logistics chain?',
            options: [
              'To own and operate trucks for transportation',
              'To generate the freight that needs to be transported',
              'To negotiate rates between carriers and brokers',
              'To manage driver HOS compliance',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q2',
            text: 'What does "broker margin" represent in US trucking?',
            options: [
              'The total amount the shipper pays for transportation',
              'The dispatcher\'s commission on each booked load',
              'The difference between what the shipper pays the broker and what the carrier receives',
              'The fee charged by load boards for posting freight',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q3',
            text: 'What is a rate confirmation (rate con) and why does it matter?',
            options: [
              'A verbal agreement between dispatcher and driver about their pay',
              'A binding written document confirming the agreed rate and load details — both parties sign before the truck moves',
              'A receipt the consignee signs upon delivery',
              'The broker\'s internal pricing guide for common lanes',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q4',
            text: 'What does HOS (Hours of Service) limit, and why does it constrain dispatch planning?',
            options: [
              'Hours of Service — federal rules capping driving time per day, which means drivers cannot take loads they lack time to complete legally',
              'Haul Over Speed — safety regulations about truck velocity on highways',
              'Handling of Shipments — warehouse protocols for cargo loading',
              'Hub Operations System — software carriers use to track active loads',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q5',
            text: 'What is "detention" in trucking and who should compensate for it?',
            options: [
              'A DOT fine for regulatory violations, paid by the carrier',
              'Waiting time beyond the free-time limit at a shipper or consignee facility — compensated by the broker/shipper',
              'The cost of fuel when driving through toll roads',
              'A penalty charged to the broker for posting inaccurate load data',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q6',
            text: 'A broker posts a load at $2,100 for 1,400 miles. What should the dispatcher do first?',
            options: [
              'Accept immediately to secure the load before competitors',
              'Calculate the RPM ($1.50/mile), compare it to the target rate, and decide whether to counter or walk away',
              'Ask the driver if the rate is acceptable',
              'Check the broker\'s reputation on load boards before engaging',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q7',
            text: 'What does "double booking" mean in freight brokerage and how does it harm carriers?',
            options: [
              'Booking two loads for the same driver simultaneously',
              'A broker offering the same load to multiple carriers at once — the losing carrier wastes time and loses planned miles with zero compensation',
              'A dispatcher booking loads two days in advance to guarantee availability',
              'Signing two rate confirmations for the same shipper on the same day',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q8',
            text: 'What is the POD (Proof of Delivery) and when is it collected?',
            options: [
              'A document the driver signs before picking up freight to confirm the planned route',
              'A broker authorization form that releases payment to the carrier',
              'A signed document collected at delivery confirming the freight arrived in acceptable condition',
              'A federal inspection certificate issued at DOT weigh stations',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q9',
            text: 'A broker calls after the rate con is signed, asking to reduce the agreed rate because "the market dropped." What is the correct dispatcher response?',
            options: [
              'Agree — keeping the broker relationship is more important than a few hundred dollars',
              'Ignore the call and proceed with the original rate',
              'Politely but firmly decline — the signed rate con is a legally binding document and the rate stands as agreed',
              'Offer a partial concession of 10% to maintain goodwill',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q10',
            text: 'What distinguishes an owner-operator from a large fleet carrier, and how does this affect dispatching?',
            options: [
              'An owner-operator drives for a large company; a fleet carrier is independent',
              'An owner-operator is a single driver running their own business — they benefit most from external dispatching because they lack the bandwidth for load searching and negotiation',
              'Owner-operators only handle dedicated contract freight; fleet carriers work the spot market exclusively',
              'Owner-operators are not permitted to work with independent dispatchers under federal law',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q11',
            text: 'Mini-case: Your driver just delivered in Phoenix, AZ — a notoriously weak outbound freight market. You find two options: Load A goes to Los Angeles, paying $900 for 370 miles ($2.43 RPM). Load B goes to Denver, paying $1,400 for 600 miles ($2.33 RPM). What is the best approach?',
            options: [
              'Take Load B — higher total dollars always means a better load',
              'Take Load A — higher RPM is always the deciding factor',
              'Evaluate both metrics and destinations: Load A has better RPM and puts the driver in LA (strong outbound market with better next-load opportunities) — likely the stronger choice overall',
              'Reject both and wait — rates from Phoenix will improve significantly within 24 hours',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q12',
            text: 'Mini-case: Tuesday 2:00 PM. Your driver is 200 miles from delivering in Atlanta when the broker calls: the consignee rescheduled — they cannot receive until Thursday morning. Your driver has a confirmed load starting Wednesday 8:00 AM from a city 150 miles north of Atlanta. The broker asks if the driver can wait. What do you do?',
            options: [
              'Agree immediately — maintaining broker relationships is the top priority',
              'Explain the scheduling conflict clearly: accepting the delay breaks the Wednesday commitment. Ask the broker for an alternative Wednesday appointment time, or whether they can source a different carrier for the delayed delivery',
              'Have the driver deliver anyway and let the consignee deal with the appointment issue',
              'Cancel both loads to avoid any scheduling conflict',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'th-q1',
            text: 'Какова основная роль shipper в логистической цепочке США?',
            options: [
              'Владеть и управлять грузовиками для перевозок',
              'Формировать груз, который необходимо перевезти',
              'Вести переговоры о ставках между carriers и брокерами',
              'Контролировать соблюдение HOS водителями',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q2',
            text: 'Что означает "broker margin" в грузоперевозках США?',
            options: [
              'Общая сумма, которую shipper платит за перевозку',
              'Комиссия диспетчера с каждого забронированного груза',
              'Разница между тем, что shipper платит брокеру, и тем, что получает carrier',
              'Плата, взимаемая биржами грузов за размещение заявок',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q3',
            text: 'Что такое rate confirmation (rate con) и почему он важен?',
            options: [
              'Устное соглашение между диспетчером и водителем об их оплате',
              'Обязывающий письменный документ с согласованной ставкой и деталями груза — обе стороны подписывают до начала перевозки',
              'Квитанция, которую consignee подписывает при получении груза',
              'Внутренний прайс-лист брокера для типовых направлений',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q4',
            text: 'Что ограничивает HOS (Hours of Service) и как это влияет на планирование диспетчера?',
            options: [
              'Hours of Service — федеральные правила, ограничивающие время вождения в сутки: водитель не может взять груз, который не успеет завершить в рамках лимита',
              'Haul Over Speed — ограничения скорости грузовиков на шоссе',
              'Handling of Shipments — складские протоколы погрузки',
              'Hub Operations System — программа отслеживания активных грузов',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q5',
            text: 'Что такое detention в грузоперевозках и кто должен его компенсировать?',
            options: [
              'Штраф DOT за нарушения, оплачиваемый carrier\'ом',
              'Время ожидания водителя сверх бесплатного лимита у shipper\'а или consignee — компенсируется брокером/shipper\'ом',
              'Стоимость топлива на платных дорогах',
              'Штраф за размещение неточных данных о грузе',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q6',
            text: 'Брокер выставляет груз за $2 100 на 1 400 миль. Что диспетчер должен сделать в первую очередь?',
            options: [
              'Принять сразу, чтобы забрать груз раньше конкурентов',
              'Рассчитать RPM ($1,50/миля), сравнить с целевой ставкой и решить: торговаться или искать другой вариант',
              'Спросить водителя, устраивает ли его эта ставка',
              'Проверить репутацию брокера на бирже грузов перед звонком',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q7',
            text: 'Что такое double booking в работе брокеров и как это вредит carriers?',
            options: [
              'Бронирование двух грузов для одного водителя одновременно',
              'Ситуация, когда брокер отдаёт один груз сразу нескольким carriers — проигравший тратит время впустую и теряет запланированные мили без какой-либо компенсации',
              'Бронирование грузов диспетчером за два дня вперёд для гарантии загрузки',
              'Подписание двух rate con от одного shipper\'а в один день',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q8',
            text: 'Что такое POD (Proof of Delivery) и когда он оформляется?',
            options: [
              'Документ, который водитель подписывает перед забором груза для подтверждения маршрута',
              'Форма брокера, разрешающая выплату carrier\'у',
              'Подписанный при доставке документ, подтверждающий, что груз принят в надлежащем состоянии',
              'Федеральное инспекционное свидетельство с весовой станции DOT',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q9',
            text: 'Брокер звонит уже после подписания rate con с просьбой снизить согласованную ставку — "рынок упал". Какова правильная реакция диспетчера?',
            options: [
              'Согласиться — отношения с брокером важнее нескольких сотен долларов',
              'Игнорировать звонок и продолжить по оригинальной ставке',
              'Вежливо, но твёрдо отказать — подписанный rate con является юридически обязывающим документом, ставка остаётся как договорились',
              'Предложить частичную скидку 10% ради поддержания отношений',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q10',
            text: 'Чем owner-operator отличается от крупного fleet carrier и как это влияет на диспетчеризацию?',
            options: [
              'Owner-operator работает на крупную компанию; fleet carrier — самостоятельный бизнес',
              'Owner-operator — одиночный водитель, ведущий собственный бизнес: он больше всех выигрывает от внешней диспетчеризации, так как не имеет ресурсов на поиск грузов и переговоры',
              'Owner-operators работают только на контрактных направлениях; fleet carriers — исключительно на спотовом рынке',
              'Федеральный закон запрещает owner-operators работать с независимыми диспетчерами',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q11',
            text: 'Мини-кейс: Ваш водитель только что сдал груз в Phoenix, AZ — известный слабый исходящий рынок. Два варианта: Груз A в Лос-Анджелес, $900 за 370 миль ($2,43 RPM). Груз B в Денвер, $1 400 за 600 миль ($2,33 RPM). Как лучше действовать?',
            options: [
              'Взять груз B — больше денег в абсолютных цифрах всегда лучше',
              'Взять груз A — более высокий RPM всегда является решающим критерием',
              'Оценить оба показателя и направления: у груза A лучше RPM, и он ставит водителя в LA — сильный исходящий рынок с лучшими возможностями для следующего груза. Скорее всего, более сильный выбор в комплексе',
              'Отказаться от обоих и ждать — ставки из Феникса существенно вырастут в течение 24 часов',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q12',
            text: 'Мини-кейс: Вторник, 14:00. Вашему водителю 200 миль до доставки в Атланте, когда брокер звонит: consignee перенёс приём — не может принять до четверга утром. У вашего водителя уже подтверждён груз на среду в 08:00 из города в 150 милях к северу от Атланты. Брокер спрашивает, может ли водитель подождать. Что делаете?',
            options: [
              'Сразу соглашаетесь — поддержание отношений с брокером является главным приоритетом',
              'Чётко объясняете конфликт расписания: принятие задержки срывает обязательство на среду. Просите брокера найти альтернативный слот в среду или передать отложенную доставку другому carrier\'у',
              'Водитель едет на доставку в любом случае, пусть consignee разбирается с appointment\'ом',
              'Отменяете оба груза, чтобы избежать любого конфликта',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '1-3': {
      type: 'text',
      body: `
        <h2>A Dispatcher's Workday — From First Call to Last Load</h2>
        <p>Before moving into practice, you need to see how real dispatching actually looks hour by hour. This lesson walks you through a complete simulated workday — the decisions made, the conversations had, and the problems solved. Connect every step back to what you studied in Theory: the roles, the economics, and the tools.</p>
        <blockquote>
          <strong>The dispatcher's day is not a list of tasks — it's a continuous cycle:</strong><br/>
          Search → Negotiate → Book → Monitor → Solve → Repeat
        </blockquote>

        <h2>7:00 AM — Morning Status Check</h2>
        <p>The day starts before the first broker call. A dispatcher who skips the morning review walks into the day blind. Before anything else, you need a clear picture of where things stand.</p>

        <h3>What to Check Every Morning</h3>
        <p><strong>Driver positions and HOS availability.</strong> Where are your drivers right now? What's their remaining Hours of Service? A driver coming off a 10-hour reset in Dallas has a full 11-hour clock — they can take a long haul. A driver who drove 9 hours yesterday has only 2 hours left — short run only, or they rest first.</p>
        <p><strong>Active loads in progress.</strong> Are all current runs on track? For each one: Is the driver on schedule? Has the delivery appointment been confirmed with the consignee? Does the broker need an ETA update?</p>
        <p><strong>Messages and emails from overnight.</strong> Did a driver report a problem while you were offline? Did a broker send a load offer? Did the consignee reschedule an appointment?</p>

        <blockquote>
          <strong>Scenario — Morning check reveals a problem:</strong><br/>
          7:00 AM. You see a driver message sent at 2:00 AM: <em>"Stuck at shipper — system outage, couldn't load until 4 AM. Running 6 hours behind."</em><br/>
          Your immediate move: call the broker before they start their day. Provide the updated ETA. Ask whether the delivery appointment can be pushed back. Get ahead of the problem — don't let the broker find out on their own. Proactive communication is what separates trusted carriers from ones that lose loads.
        </blockquote>

        <h2>8:00 AM — Searching for New Loads</h2>
        <p>Status check done. You open DAT or Truckstop and start working the boards. Load searching is not scrolling — it's analysis.</p>

        <h3>How to Search Effectively</h3>
        <p><strong>Step 1: Filter by driver position.</strong> Set the pickup radius around your driver's current location — or where they'll be after their current delivery ends. Driver delivering in Memphis at noon? Search loads picking up in Memphis or within 50–100 miles.</p>
        <p><strong>Step 2: Evaluate the lane.</strong> Where does the load go? Is the destination a strong freight market with good outbound options — or a dead-end where your driver will struggle to find the next load? A run ending in Atlanta is attractive. A run ending in rural Montana is a trap.</p>
        <p><strong>Step 3: Calculate RPM — not just total pay.</strong> Never evaluate a load by total dollars alone.</p>

        <blockquote>
          <strong>RPM calculation — why it matters:</strong><br/>
          Load A: pays <strong>$2,400</strong> | distance: 1,100 miles → RPM = <strong>$2.18/mile</strong><br/>
          Load B: pays <strong>$3,200</strong> | distance: 1,800 miles → RPM = <strong>$1.78/mile</strong><br/><br/>
          Load B pays $800 more in total. But Load A earns $0.40 more per mile — meaning better profit after fuel and driver costs. A dispatcher who only sees the big number takes Load B and loses money. Always run the math.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Semi-truck on interstate highway" loading="lazy" />
          <figcaption>Every RPM calculation behind a screen translates into decisions about trucks like this one — and whether the run is actually profitable</figcaption>
        </figure>

        <p><strong>Step 4: Check the timing.</strong> Does the pickup appointment fit the driver's available HOS and current location? A 6:00 AM pickup that requires 9 hours of driving tonight — when the driver only has 4 hours left — doesn't work. Book it anyway and you've created a service failure.</p>

        <h2>9:15 AM — Calling the Broker</h2>
        <p>You've found a strong load. Now you pick up the phone. Every broker call follows the same structure — and every call is a negotiation.</p>

        <h3>Structure of a Broker Call</h3>
        <p><strong>Opening — identify yourself and the load:</strong></p>
        <blockquote>
          <em>"Hi, this is [Name] with [Carrier]. I'm calling about the load posted — Atlanta to Chicago, picking up today. Is it still available?"</em>
        </blockquote>
        <p><strong>Confirm the details before negotiating.</strong> Make sure you understand exactly what you're moving before you commit to a price:</p>
        <blockquote>
          <em>"Can you confirm the weight and trailer type? Any special requirements? And is there flexibility on the pickup time?"</em>
        </blockquote>
        <p><strong>Negotiate the rate.</strong> The broker's posted price is rarely their ceiling. Push:</p>
        <blockquote>
          <strong>Real negotiation — step by step:</strong><br/>
          Broker posts: $1,900<br/>
          You: <em>"I have a truck in Atlanta today — clean carrier, reliable. I can cover this, but I need $2,200 to make the numbers work. What can you do?"</em><br/>
          Broker: <em>"Best I can do is $2,050."</em><br/>
          You: <em>"Split the difference — $2,125?"</em><br/>
          Broker: <em>"Done. Sending the rate con now."</em><br/><br/>
          Result: +$225 above the posted rate. On 10 loads per month, that's $2,250 in additional revenue — just from making the counter.
        </blockquote>

        <h3>Principles for Every Broker Call</h3>
        <p>Check the DAT rate history for this lane before dialing — know what the market is paying. Never say <em>"I'll take whatever you're offering"</em> — it signals desperation and kills your leverage. Always give a reason for your counter: available now, reliable carrier, clean safety record. A counter always moves the number — silence after your counter often means the broker is checking their margin.</p>

        <h2>10:00 AM — Booking the Load</h2>
        <p>Rate agreed. Now execute without mistakes.</p>

        <h3>The Booking Checklist</h3>
        <p><strong>Review the rate confirmation (rate con) carefully.</strong> When the broker sends it, check: Are pickup and delivery addresses correct? Does the agreed rate match what was discussed on the phone? Are appointment times accurate? Does the commodity and weight match what your truck can legally carry?</p>
        <blockquote>
          <strong>Never let the driver move before the rate con is signed by both parties.</strong> A verbal agreement means nothing if there's a dispute later. The signed rate con is your legal protection.
        </blockquote>
        <p><strong>Brief the driver with full details:</strong></p>
        <blockquote>
          <em>"Got you a load. Pickup at [address] — appointment is 2:00 PM today. It's 22,000 lbs of auto parts, dry van. Delivery in Nashville, Thursday 8:00 AM. Rate con is coming to your email — check it before you head out. Questions?"</em>
        </blockquote>
        <p><strong>Confirm HOS before the driver moves.</strong> Do they have enough hours to make the pickup on time and complete the run legally? If it's close — flag it now, before they leave.</p>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Mercedes-Benz Sprinter cargo van" loading="lazy" />
          <figcaption>A Sprinter cargo van — one of the vehicle types a dispatcher may coordinate alongside full-size trucks, used for smaller expedited loads</figcaption>
        </figure>

        <h2>12:30 PM — Driver at Pickup, Detention Clock Starts</h2>
        <p>The driver checks in at the shipper. Standard free time is 2 hours. After that, detention pay applies — typically $25–75/hour, depending on what was agreed in the rate con.</p>

        <blockquote>
          <strong>Scenario — Claiming detention pay:</strong><br/>
          Driver checks in at 12:30 PM. By 2:30 PM, still not loaded — the dock is backed up.<br/>
          Your actions:<br/>
          1. Have the driver send you proof of check-in time (screenshot, text message, guard stamp).<br/>
          2. At exactly 2:30 PM, contact the broker: <em>"Driver has been at the shipper since 12:30 — we're at 2 hours free time now and still not loaded. Detention is accruing. Confirm this will be added to the invoice."</em><br/>
          3. Document everything: time of arrival, time loading began, time driver departed.<br/><br/>
          Detention pay will not happen automatically. You must claim it, document it, and follow up. This is money the carrier is owed — and it's your job to collect it.
        </blockquote>

        <h2>2:45 PM — Driver Loaded, Trip Begins</h2>
        <p>BOL signed. Truck moving. Now your job shifts to active monitoring — and parallel work on the next load.</p>

        <h3>Check Call Schedule</h3>
        <p>First check call 2–3 hours after departure. Regular check calls every 4–6 hours while the driver is on the road. One check call the evening before delivery. A final call 1–2 hours from the delivery destination.</p>

        <blockquote>
          <strong>What a check call sounds like:</strong><br/>
          <em>"Hey, just checking in — where are you right now?"</em><br/>
          Driver: <em>"Just crossed into Tennessee, about 90 miles from Nashville."</em><br/>
          <em>"Good. What's your ETA to the delivery?"</em><br/>
          Driver: <em>"Should be there around 7:30 AM tomorrow."</em><br/>
          <em>"Perfect. Appointment is 8:00 AM — you're in good shape. Call me if anything changes."</em><br/><br/>
          Thirty seconds. The broker is updated. The driver feels managed. Problems are caught early.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck on delivery route" loading="lazy" />
          <figcaption>A box truck on a delivery route — while one driver is on the road, the dispatcher is already sourcing the next load for when they arrive</figcaption>
        </figure>

        <h3>While the Driver Moves — Find the Next Load</h3>
        <p>The driver delivers in Nashville Thursday morning. You start searching for Nashville outbound loads right now — Wednesday afternoon. By the time the driver arrives, the next load should already be confirmed. Zero downtime, zero deadhead.</p>

        <h2>5:00 PM — Unexpected Problem</h2>
        <p>The broker calls: <em>"The consignee in Nashville rescheduled — they can't receive Thursday morning. Earliest is Friday afternoon."</em></p>
        <p>This is not a crisis. It's a decision point. How you handle it determines the financial outcome.</p>

        <blockquote>
          <strong>Scenario — Consignee reschedule, three options:</strong><br/><br/>
          <strong>Option 1: Accept the delay.</strong> Driver arrives Thursday, waits until Friday afternoon. ~30 hours of waiting. Detention may accrue — but is it covered in the rate con? You also lose the Thursday next-load booking.<br/><br/>
          <strong>Option 2: Negotiate with the broker.</strong><br/>
          <em>"We have a confirmed load out of Nashville Friday morning — we can't hold the driver until Friday afternoon. Can the consignee take it Thursday evening? Or can you find a different carrier for the delay and release us after delivery?"</em><br/><br/>
          <strong>Option 3: Find a creative solution.</strong> Is there a drop yard or cross-dock near Nashville? The driver offloads the freight there, releases your truck, and the broker arranges final delivery separately. Your driver moves on. Advanced — but real.
        </blockquote>

        <p>The principle is always the same: <strong>never react emotionally — work the problem</strong>. Every unexpected situation has a financial impact. Your job is to minimize it with clear thinking and direct communication.</p>

        <h2>7:30 AM (Next Day) — Delivery Complete</h2>
        <p>Driver arrives in Nashville. Consignee receives, inspects, signs the POD. The driver calls: <em>"Delivered. I've got the POD."</em></p>

        <h3>Immediate Post-Delivery Actions</h3>
        <p>Confirm with the broker: <em>"Delivery is complete, POD in hand — invoice to follow."</em> Submit the invoice (or pass it to billing). Note the broker's performance: did they communicate well? Were problems handled professionally? This informs how you prioritize them for future work.</p>
        <blockquote>
          <strong>Most importantly — the driver doesn't sit.</strong> The next load was found yesterday. Pickup is 2 hours from the delivery point. The driver moves immediately. Zero deadhead. This is what proactive dispatching looks like.
        </blockquote>

        <h2>The Full Day at a Glance</h2>
        <blockquote>
          <strong>One complete dispatcher cycle:</strong><br/>
          <strong>7:00 AM</strong> — Status check: driver positions confirmed, active loads verified, overnight messages reviewed<br/>
          <strong>8:00 AM</strong> — Load search: RPM calculated, lane analyzed, best option identified<br/>
          <strong>9:15 AM</strong> — Broker call: negotiated $1,900 posted rate up to $2,125 — rate con signed<br/>
          <strong>10:00 AM</strong> — Driver briefed, pickup details confirmed, HOS verified<br/>
          <strong>12:30 PM</strong> — Detention claimed at shipper: arrival time documented, broker notified<br/>
          <strong>2:45 PM</strong> — Driver loaded and moving: check call schedule set<br/>
          <strong>5:00 PM</strong> — Consignee reschedule handled: negotiated Thursday evening delivery window<br/>
          <strong>Evening</strong> — Next load out of Nashville already found and confirmed<br/>
          <strong>7:30 AM (next day)</strong> — Delivery complete, POD collected, invoice sent, driver immediately reloaded<br/><br/>
          <strong>Result:</strong> $2,125 earned on this run, zero deadhead miles, broker relationship strengthened, driver continuously productive
        </blockquote>

        <h2>What Makes a Dispatcher Effective</h2>
        <p>Track these numbers every day. They tell you whether you're running the operation well or just reacting to it.</p>
        <blockquote>
          <strong>Key daily metrics:</strong><br/>
          <strong>RPM target</strong> — Know your minimum profitable rate per mile. Typically $1.80–$2.50+ depending on equipment type and operating costs. Any load below this number requires a strong justification.<br/>
          <strong>Deadhead %</strong> — What share of your total miles are empty? Target: below 10–15%. High deadhead means poor planning or weak market positioning.<br/>
          <strong>Detention incidents</strong> — How often are drivers waiting beyond free time? Are you claiming it every time? Unclaimed detention is lost revenue.<br/>
          <strong>On-time delivery rate</strong> — Brokers track this. A strong on-time record means preferred carrier status, better load offers, and faster rate confirmations.
        </blockquote>
        <p>The difference between average dispatching and excellent dispatching is not talent — it's preparation, market knowledge, and the discipline to run every decision through the numbers before acting.</p>
      `,
      bodyRu: `
        <h2>Рабочий день диспетчера — от первого звонка до последнего груза</h2>
        <p>Прежде чем переходить к практике, нужно увидеть, как реальная работа диспетчера выглядит час за часом. В этом уроке разбирается полный симулированный рабочий день — принимаемые решения, ведущиеся переговоры, возникающие проблемы и их решения. Каждый шаг отсылает к тому, что вы изучили в теории: роли участников, экономика и инструменты.</p>
        <blockquote>
          <strong>День диспетчера — это не список задач, а непрерывный цикл:</strong><br/>
          Поиск → Переговоры → Бронирование → Мониторинг → Решение проблем → Снова поиск
        </blockquote>

        <h2>7:00 — Утренняя проверка статуса</h2>
        <p>День начинается до первого звонка брокеру. Диспетчер, который пропускает утренний обзор, входит в день вслепую. Прежде чем что-либо делать, нужна чёткая картина того, как обстоят дела.</p>

        <h3>Что проверяется каждое утро</h3>
        <p><strong>Позиции водителей и доступные часы HOS.</strong> Где сейчас ваши водители? Каков остаток их Hours of Service? Водитель, который завершил 10-часовой отдых в Далласе, имеет полный 11-часовой лимит — он может взять длинный рейс. Водитель, проехавший 9 часов вчера, имеет только 2 часа — только короткий рейс или сначала отдых.</p>
        <p><strong>Активные грузы в процессе.</strong> Все текущие рейсы идут по плану? По каждому: соблюдается ли расписание? Подтверждён ли appointment у consignee? Нужно ли обновить ETA для брокера?</p>
        <p><strong>Сообщения и письма с ночи.</strong> Водитель сообщал о проблеме пока вы были офлайн? Брокер прислал предложение по грузу? Consignee перенёс appointment?</p>

        <blockquote>
          <strong>Сценарий — Утренняя проверка выявляет проблему:</strong><br/>
          7:00. Вы видите сообщение водителя, отправленное в 2:00 ночи: <em>"Застрял у shipper'а — системный сбой, не могли загрузить до 4 утра. Опаздываю на 6 часов."</em><br/>
          Ваш немедленный шаг: звоните брокеру до начала его рабочего дня. Сообщаете обновлённый ETA. Спрашиваете, можно ли сдвинуть delivery appointment. Опережаете проблему — не позволяйте брокеру узнать о ней самому. Проактивная коммуникация — это то, что отличает надёжных carriers от тех, кого перестают звать.
        </blockquote>

        <h2>8:00 — Поиск новых грузов</h2>
        <p>Проверка статуса завершена. Открываете DAT или Truckstop и начинаете работу с биржей. Поиск грузов — это не скроллинг, это анализ.</p>

        <h3>Как искать эффективно</h3>
        <p><strong>Шаг 1: Фильтр по позиции водителя.</strong> Установите радиус pickup вокруг текущего положения водителя — или места, где он окажется после текущей доставки. Водитель сдаёт груз в Мемфисе в полдень? Ищите грузы с pickup в Мемфисе или в радиусе 50–100 миль.</p>
        <p><strong>Шаг 2: Оцените направление (lane).</strong> Куда идёт груз? Сильный ли рынок в городе назначения — есть ли исходящие грузы? Рейс, заканчивающийся в Атланте, привлекателен. Рейс, заканчивающийся в малолюдной Монтане, — ловушка.</p>
        <p><strong>Шаг 3: Считайте RPM, а не только итоговую сумму.</strong> Никогда не оценивайте груз только по общему количеству долларов.</p>

        <blockquote>
          <strong>Расчёт RPM — почему это важно:</strong><br/>
          Груз A: платит <strong>$2 400</strong> | расстояние: 1 100 миль → RPM = <strong>$2,18/миля</strong><br/>
          Груз B: платит <strong>$3 200</strong> | расстояние: 1 800 миль → RPM = <strong>$1,78/миля</strong><br/><br/>
          Груз B платит на $800 больше в общей сумме. Но Груз A приносит на $0,40 больше за каждую милю — то есть выше прибыль после расходов на топливо и водителя. Диспетчер, видящий только большое число, берёт Груз B и теряет деньги. Всегда считайте математику.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Грузовик на магистральном шоссе" loading="lazy" />
          <figcaption>Каждый расчёт RPM за монитором — это решение о том, будет ли этот грузовик двигаться прибыльно</figcaption>
        </figure>

        <p><strong>Шаг 4: Проверьте тайминг.</strong> Совпадает ли pickup appointment с доступными часами HOS водителя и его текущим положением? Pickup в 6:00 утра, требующий 9 часов езды ночью — при том, что у водителя только 4 часа — не работает. Забронируете так — получите срыв доставки.</p>

        <h2>9:15 — Звонок брокеру</h2>
        <p>Вы нашли хороший груз. Теперь берёте трубку. Каждый звонок брокеру следует одной структуре — и каждый звонок является переговорами.</p>

        <h3>Структура звонка брокеру</h3>
        <p><strong>Открытие — представьтесь и назовите груз:</strong></p>
        <blockquote>
          <em>"Привет, это [Имя] от [Carrier]. Звоню по вашему грузу — Атланта в Чикаго, pickup сегодня. Груз ещё доступен?"</em>
        </blockquote>
        <p><strong>Уточните детали перед переговорами.</strong> Убедитесь, что чётко понимаете груз до того, как называете цену:</p>
        <blockquote>
          <em>"Можете подтвердить вес и тип прицепа? Есть особые требования? И есть ли гибкость по времени pickup?"</em>
        </blockquote>
        <p><strong>Торгуйтесь по ставке.</strong> Выставленная брокером цена редко является его максимумом. Давите:</p>
        <blockquote>
          <strong>Реальные переговоры — шаг за шагом:</strong><br/>
          Брокер выставляет: $1 900<br/>
          Вы: <em>"У меня есть машина в Атланте сегодня — надёжный carrier, чистая история. Могу закрыть, но мне нужно $2 200, чтобы это имело смысл. Что можете сделать?"</em><br/>
          Брокер: <em>"Лучшее, что могу — $2 050."</em><br/>
          Вы: <em>"Давайте поделим разницу — $2 125?"</em><br/>
          Брокер: <em>"Договорились. Высылаю rate con."</em><br/><br/>
          Результат: +$225 сверх выставленной ставки. На 10 грузах в месяц — это $2 250 дополнительной выручки. Только за то, что сделали контрпредложение.
        </blockquote>

        <h3>Принципы каждого звонка брокеру</h3>
        <p>Проверьте историю ставок DAT по этому направлению до звонка — знайте, что платит рынок. Никогда не говорите <em>"Беру по вашей цене"</em> — это сигнализирует об отчаянии и уничтожает ваши позиции. Всегда давайте причину для контрпредложения: доступен сейчас, надёжный carrier, чистый safety record. Контрпредложение всегда двигает цифру — молчание брокера после вашего контра часто означает, что он проверяет свою маржу.</p>

        <h2>10:00 — Бронирование груза</h2>
        <p>Ставка согласована. Теперь выполняйте без ошибок.</p>

        <h3>Чеклист бронирования</h3>
        <p><strong>Внимательно проверьте rate confirmation (rate con).</strong> Когда брокер его присылает, проверьте: правильные ли адреса pickup и delivery? Совпадает ли согласованная ставка с тем, что обсуждалось по телефону? Верны ли времена appointment? Соответствуют ли тип груза и вес возможностям вашего грузовика?</p>
        <blockquote>
          <strong>Никогда не позволяйте водителю двигаться до подписания rate con обеими сторонами.</strong> Устная договорённость ничего не значит в случае спора. Подписанный rate con — ваша юридическая защита.
        </blockquote>
        <p><strong>Проинструктируйте водителя со всеми деталями:</strong></p>
        <blockquote>
          <em>"Нашёл тебе груз. Pickup по адресу [адрес] — appointment в 14:00 сегодня. Это 22 000 lbs автозапчастей, dry van. Доставка в Нэшвилл, Теннесси — четверг, 08:00. Rate con придёт на почту — проверь перед выездом. Вопросы есть?"</em>
        </blockquote>
        <p><strong>Подтвердите HOS до выезда водителя.</strong> Хватит ли ему часов, чтобы вовремя доехать до pickup и завершить рейс в рамках закона? Если впритык — решайте это сейчас, не после того, как он уехал.</p>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Cargo van Sprinter для срочных грузов" loading="lazy" />
          <figcaption>Sprinter cargo van — один из типов транспорта, которым управляет диспетчер наряду с большегрузами, используется для срочных небольших грузов</figcaption>
        </figure>

        <h2>12:30 — Водитель на pickup, отсчёт detention начался</h2>
        <p>Водитель проходит check-in у shipper'а. Стандартное бесплатное время — 2 часа. После этого начисляется detention pay — обычно $25–75/час в зависимости от того, что согласовано в rate con.</p>

        <blockquote>
          <strong>Сценарий — Получение detention pay:</strong><br/>
          Водитель проходит check-in в 12:30. К 14:30 всё ещё не загружен — на доке очередь.<br/>
          Ваши действия:<br/>
          1. Попросите водителя прислать подтверждение времени check-in (скриншот, смс, штамп охраны).<br/>
          2. Ровно в 14:30 пишете/звоните брокеру: <em>"Водитель у shipper'а с 12:30 — мы на 2 часах бесплатного времени, загрузка ещё не началась. Detention накапливается. Подтвердите, что он будет добавлен к invoice."</em><br/>
          3. Фиксируйте всё письменно: время прибытия, время начала погрузки, время отъезда.<br/><br/>
          Detention pay не происходит автоматически. Нужно требовать, документировать и следить за оплатой. Это деньги, которые причитаются carrier'у — и ваша работа их получить.
        </blockquote>

        <h2>14:45 — Водитель загружен, рейс начался</h2>
        <p>BOL подписан. Грузовик движется. Теперь ваша роль переключается на активный мониторинг — и параллельную работу по следующему грузу.</p>

        <h3>График check calls</h3>
        <p>Первый check call через 2–3 часа после отправления. Регулярные check calls каждые 4–6 часов. Звонок накануне доставки вечером. Финальный звонок за 1–2 часа до пункта назначения.</p>

        <blockquote>
          <strong>Как звучит check call:</strong><br/>
          <em>"Привет, просто проверяю — где ты сейчас находишься?"</em><br/>
          Водитель: <em>"Только въехал в Теннесси, около 90 миль до Нэшвилла."</em><br/>
          <em>"Хорошо. Какой ETA на доставку?"</em><br/>
          Водитель: <em>"Должен быть там около 7:30 утра завтра."</em><br/>
          <em>"Отлично. Appointment в 8:00 — всё хорошо. Звони, если что изменится."</em><br/><br/>
          Тридцать секунд. Брокер в курсе. Водитель чувствует контроль. Проблемы выявляются до того, как становятся кризисом.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck на маршруте доставки" loading="lazy" />
          <figcaption>Box truck на маршруте — пока один водитель в пути, диспетчер уже ищет следующий груз к моменту его прибытия</figcaption>
        </figure>

        <h3>Пока водитель едет — ищите следующий груз</h3>
        <p>Водитель сдаёт груз в Нэшвилле в четверг утром. Вы начинаете искать исходящие грузы из Нэшвилла прямо сейчас — в среду днём. К моменту прибытия водителя следующий груз уже должен быть подтверждён. Нулевой простой, нулевой deadhead.</p>

        <h2>17:00 — Непредвиденная ситуация</h2>
        <p>Звонит брокер: <em>"Consignee в Нэшвилле перенёс приём — не может принять в четверг утром. Ближайший слот — пятница днём."</em></p>
        <p>Это не кризис — это точка принятия решения. То, как вы её обработаете, определит финансовый результат.</p>

        <blockquote>
          <strong>Сценарий — Перенос consignee, три варианта:</strong><br/><br/>
          <strong>Вариант 1: Принять задержку.</strong> Водитель приезжает в четверг, ждёт до пятницы днём — около 30 часов ожидания. Detention может накапливаться, но покрывается ли он rate con'ом? К тому же вы теряете следующий груз, забронированный на четверг.<br/><br/>
          <strong>Вариант 2: Договориться с брокером.</strong><br/>
          <em>"У нас подтверждённый груз из Нэшвилла в пятницу утром — мы не можем держать водителя до пятницы днём. Может ли consignee принять в четверг вечером? Или вы можете найти другого carrier'а для задержанной доставки и отпустить нас?"</em><br/><br/>
          <strong>Вариант 3: Найти нестандартное решение.</strong> Есть ли рядом с Нэшвиллом drop yard или cross-dock? Водитель сгружает там, освобождает вашу машину, брокер организует финальную доставку отдельно. Ваш водитель движется дальше. Продвинутый вариант — но реальный.
        </blockquote>

        <p>Принцип всегда один: <strong>не реагировать эмоционально — работать с проблемой</strong>. Каждая непредвиденная ситуация имеет финансовые последствия. Ваша задача — минимизировать их чётким мышлением и прямой коммуникацией.</p>

        <h2>7:30 (следующий день) — Доставка завершена</h2>
        <p>Водитель прибывает в Нэшвилл. Consignee принимает, проверяет, подписывает POD. Водитель звонит: <em>"Сдал. POD у меня."</em></p>

        <h3>Действия сразу после доставки</h3>
        <p>Сообщаете брокеру: <em>"Доставка выполнена, POD в руках — invoice следует."</em> Выставляете invoice (или передаёте в отдел биллинга). Отмечаете работу брокера: хорошо ли он коммуницировал? Решались ли проблемы профессионально? Это влияет на приоритетность в будущей работе.</p>
        <blockquote>
          <strong>Самое главное — водитель не простаивает.</strong> Следующий груз найден вчера. Pickup в 2 часах от точки доставки. Водитель сразу движется дальше. Нулевой deadhead. Вот как выглядит проактивная диспетчеризация.
        </blockquote>

        <h2>Весь день — одним взглядом</h2>
        <blockquote>
          <strong>Один полный цикл диспетчера:</strong><br/>
          <strong>7:00</strong> — Проверка статуса: позиции водителей, активные грузы, ночные сообщения<br/>
          <strong>8:00</strong> — Поиск груза: RPM рассчитан, lane проанализирован, лучший вариант найден<br/>
          <strong>9:15</strong> — Звонок брокеру: выторговано $2 125 вместо выставленных $1 900 — rate con подписан<br/>
          <strong>10:00</strong> — Водитель проинструктирован, pickup подтверждён, HOS проверен<br/>
          <strong>12:30</strong> — Detention заявлен у shipper'а: время прибытия зафиксировано, брокер уведомлён<br/>
          <strong>14:45</strong> — Водитель загружен и движется: график check calls установлен<br/>
          <strong>17:00</strong> — Перенос consignee обработан: согласовано доставку в четверг вечером<br/>
          <strong>Вечер</strong> — Следующий груз из Нэшвилла найден и подтверждён<br/>
          <strong>7:30 (следующий день)</strong> — Доставка выполнена, POD получен, invoice выставлен, водитель немедленно перегружен<br/><br/>
          <strong>Результат:</strong> $2 125 заработано на этом рейсе, нулевой deadhead, отношения с брокером укреплены, водитель непрерывно продуктивен
        </blockquote>

        <h2>Что делает диспетчера эффективным</h2>
        <p>Отслеживайте эти цифры каждый день. Они показывают, управляете ли вы операцией — или просто реагируете на события.</p>
        <blockquote>
          <strong>Ключевые ежедневные метрики:</strong><br/>
          <strong>Целевой RPM</strong> — знайте минимально прибыльную ставку за милю. Обычно $1,80–$2,50+ в зависимости от типа оборудования и операционных расходов. Любой груз ниже этого порога требует весомого обоснования.<br/>
          <strong>% deadhead</strong> — какая доля ваших миль порожняя? Цель: ниже 10–15%. Высокий deadhead означает слабое планирование или слабую рыночную позицию.<br/>
          <strong>Инциденты с detention</strong> — как часто водители ждут сверх бесплатного времени? Требуете ли вы компенсацию каждый раз? Незаявленный detention — потерянная выручка.<br/>
          <strong>Процент своевременных доставок</strong> — брокеры это отслеживают. Высокий on-time rate = статус предпочтительного carrier'а, лучшие предложения по грузам, более быстрые rate confirmations.
        </blockquote>
        <p>Разница между средней и отличной диспетчеризацией — не талант. Это подготовка, знание рынка и дисциплина принимать каждое решение на основе цифр, а не интуиции.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'dm-q1',
            text: 'What is the primary purpose of the morning status check at the start of a dispatcher\'s day?',
            options: [
              'To update personal earnings tracking and invoice records',
              'To review driver positions, HOS availability, active load status, and any overnight messages before making any new decisions',
              'To post available trucks on load boards for brokers to see',
              'To schedule check calls for the entire week in advance',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q2',
            text: 'A load pays $3,200 for 1,800 miles. Another load pays $2,400 for 1,100 miles. Which has the better RPM and what does that mean?',
            options: [
              'The $3,200 load — higher total pay always means better profitability',
              'The $2,400 load — its RPM is $2.18/mile vs $1.78/mile, meaning it generates more profit per mile after costs',
              'They are equal — total pay and RPM are the same metric',
              'RPM only matters for loads over 1,500 miles',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q3',
            text: 'Before negotiating a rate with a broker, what should a dispatcher do first?',
            options: [
              'Accept the posted rate to secure the load quickly before competitors',
              'Check the DAT rate history for this lane to understand what the market is currently paying',
              'Call the driver to confirm they want the load',
              'Email the broker their carrier\'s safety rating and insurance documents',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q4',
            text: 'What is a check call and how often should they typically be made during a long-haul trip?',
            options: [
              'A call to the broker to check if the rate can be increased mid-trip — once per day',
              'A brief call to the driver confirming location and status — every 4–6 hours, with extra calls before and near delivery',
              'A call to the consignee to verify the delivery appointment — once at the start of the trip',
              'A call to DOT to report driver compliance — only when issues arise',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q5',
            text: 'The driver arrives at the shipper at 12:30 PM but is not loaded until 4:00 PM. What should the dispatcher do?',
            options: [
              'Nothing — waiting at the shipper is a normal part of trucking with no compensation',
              'Document the driver\'s arrival time, notify the broker that detention is accruing from the 2-hour mark, and submit a detention claim on the invoice',
              'Cancel the load — excessive waiting time is grounds for terminating the agreement',
              'Contact the consignee to warn them of a potential late delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q6',
            text: 'When should a dispatcher start searching for the next load after booking the current one?',
            options: [
              'After the current delivery is confirmed complete and the POD is received',
              'The morning of the delivery day',
              'While the driver is in transit — ideally finding the next load the day before delivery so there is zero downtime',
              'Only after the driver requests a new assignment',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q7',
            text: 'Why should a dispatcher never let the driver move before the rate confirmation is signed?',
            options: [
              'Federal law requires a signed rate con before any truck can legally depart',
              'The signed rate con is the legal document protecting the agreed rate — without it, the broker can change terms or deny payment in a dispute',
              'Insurance coverage does not activate until the rate con is signed',
              'The driver needs the rate con to know which highway route to take',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q8',
            text: 'What does "deadhead" mean and why does minimizing it matter?',
            options: [
              'A cancelled load — minimizing it means fewer lost bookings',
              'Miles driven with an empty trailer generating zero revenue — it costs fuel and driver time with no income, directly reducing profitability',
              'Time spent waiting at a shipper or consignee — minimizing it reduces driver fatigue',
              'A broker who does not respond after booking — avoiding them improves reliability',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q9',
            text: 'A broker posts a load at $1,900. You call and say you need $2,200. The broker says their ceiling is $2,050. What is the best next move?',
            options: [
              'Accept $2,050 — the broker has stated their maximum and further pushing will lose the load',
              'Reject the load entirely — only accept loads that meet your full ask',
              'Counter with $2,125 (split the difference) — a reasonable middle ground that often gets accepted',
              'Ask the driver if $2,050 is acceptable before responding to the broker',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q10',
            text: 'What are the key daily metrics an effective dispatcher should track?',
            options: [
              'Number of broker calls made, total hours worked, and number of emails sent',
              'RPM target, deadhead percentage, detention claims, and on-time delivery rate',
              'Driver mood rating, broker friendliness score, and load board subscription cost',
              'Total miles driven, number of state borders crossed, and fuel price averages',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q11',
            text: 'Mini-case: It\'s 6:00 AM. Your driver messages: "Truck won\'t start — engine issue. I have a load picking up at 9:00 AM." What do you do?',
            options: [
              'Wait until 8:00 AM to see if the driver resolves it themselves before taking action',
              'Immediately call the broker, explain the mechanical issue, ask for a later pickup time or whether they need to source another carrier — then help the driver arrange roadside assistance and document everything',
              'Cancel the load without notifying the broker and search for a new load for tomorrow',
              'Have the driver call the broker directly — mechanical issues are the driver\'s responsibility',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q12',
            text: 'Mini-case: It\'s 3:00 PM. Your driver just delivered. The next booked load picks up tomorrow at 7:00 AM, 450 miles away. The driver has 8 hours of available HOS. Should the driver drive now or wait until morning?',
            options: [
              'Wait until morning — driving at night is dangerous and not worth the risk',
              'Drive now — 450 miles at highway speed takes roughly 7 hours, which fits within the 8-hour HOS window. Arriving tonight means the driver can rest and be ready for the 7:00 AM appointment. Waiting means a rushed morning or a missed pickup',
              'Drive halfway and rest — always split long drives regardless of HOS availability',
              'Call the broker and ask them to move the pickup to noon tomorrow',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'dm-q1',
            text: 'Какова основная цель утренней проверки статуса в начале рабочего дня диспетчера?',
            options: [
              'Обновить личный учёт заработка и записи по invoice',
              'Узнать позиции водителей, доступные часы HOS, статус активных грузов и ночные сообщения до принятия каких-либо новых решений',
              'Разместить доступные грузовики на биржах грузов для брокеров',
              'Запланировать check calls на всю неделю вперёд',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q2',
            text: 'Груз A платит $3 200 за 1 800 миль. Груз B платит $2 400 за 1 100 миль. У какого лучше RPM и что это означает?',
            options: [
              'Груз A — более высокая итоговая сумма всегда означает большую прибыльность',
              'Груз B — его RPM $2,18/миля против $1,78/миля, то есть он приносит больше прибыли на каждую милю после расходов',
              'Они равны — итоговая сумма и RPM — это одно и то же',
              'RPM важен только для грузов свыше 1 500 миль',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q3',
            text: 'Что диспетчер должен сделать в первую очередь перед переговорами о ставке с брокером?',
            options: [
              'Принять выставленную ставку, чтобы быстро забрать груз до конкурентов',
              'Проверить историю ставок DAT по этому направлению, чтобы знать, что сейчас платит рынок',
              'Позвонить водителю и уточнить, хочет ли он этот груз',
              'Отправить брокеру safety rating и страховые документы carrier\'а',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q4',
            text: 'Что такое check call и как часто их нужно делать во время дальнего рейса?',
            options: [
              'Звонок брокеру с просьбой повысить ставку в процессе рейса — один раз в день',
              'Короткий звонок водителю для подтверждения местоположения и статуса — каждые 4–6 часов, с дополнительными звонками перед доставкой и вблизи пункта назначения',
              'Звонок consignee для подтверждения delivery appointment — один раз в начале рейса',
              'Звонок в DOT для отчёта о соблюдении водителем правил — только при проблемах',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q5',
            text: 'Водитель прибывает к shipper\'у в 12:30, но загружается только в 16:00. Что должен сделать диспетчер?',
            options: [
              'Ничего — ожидание у shipper\'а — обычная часть работы без компенсации',
              'Зафиксировать время прибытия водителя, уведомить брокера о накоплении detention с отметки 2 часов и включить detention claim в invoice',
              'Отменить груз — чрезмерное ожидание является основанием для расторжения договора',
              'Связаться с consignee, чтобы предупредить о возможном опоздании',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q6',
            text: 'Когда диспетчер должен начинать поиск следующего груза после бронирования текущего?',
            options: [
              'После подтверждения текущей доставки и получения POD',
              'Утром в день доставки',
              'Пока водитель в пути — идеально найти следующий груз накануне доставки, чтобы не было простоев',
              'Только после того, как водитель сам попросит новое задание',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q7',
            text: 'Почему нельзя позволять водителю двигаться до подписания rate confirmation?',
            options: [
              'Федеральный закон требует подписанного rate con до любого законного отправления грузовика',
              'Подписанный rate con — это юридический документ, защищающий согласованную ставку: без него брокер может изменить условия или отказать в оплате при споре',
              'Страховое покрытие не активируется до подписания rate con',
              'Водителю нужен rate con, чтобы знать, каким шоссе ехать',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q8',
            text: 'Что такое deadhead и почему важно его минимизировать?',
            options: [
              'Отменённый груз — минимизация означает меньше потерянных бронирований',
              'Мили, пройденные с пустым прицепом без выручки — они стоят топлива и времени водителя при нулевом доходе, напрямую снижая прибыльность',
              'Время ожидания у shipper\'а или consignee — минимизация снижает усталость водителя',
              'Брокер, который не отвечает после бронирования — избегание таких улучшает надёжность',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q9',
            text: 'Брокер выставил груз за $1 900. Вы звоните и говорите, что вам нужно $2 200. Брокер говорит, что его потолок — $2 050. Какой лучший следующий шаг?',
            options: [
              'Принять $2 050 — брокер назвал свой максимум, дальнейшее давление приведёт к потере груза',
              'Полностью отказаться от груза — принимать только грузы, которые соответствуют вашему полному запросу',
              'Предложить $2 125 (разделить разницу) — разумный компромисс, который часто принимается',
              'Спросить водителя, устраивает ли его $2 050, прежде чем отвечать брокеру',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q10',
            text: 'Какие ключевые ежедневные метрики должен отслеживать эффективный диспетчер?',
            options: [
              'Количество звонков брокерам, отработанные часы и количество отправленных писем',
              'Целевой RPM, процент deadhead, заявки на detention и процент своевременных доставок',
              'Настроение водителя, оценка дружелюбности брокера и стоимость подписки на биржу грузов',
              'Общий пробег, количество пересечённых границ штатов и средние цены на топливо',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q11',
            text: 'Мини-кейс: 6:00 утра. Водитель пишет: "Машина не заводится — проблема с двигателем. У меня pickup в 9:00." Что делаете?',
            options: [
              'Ждёте до 8:00, чтобы посмотреть, решит ли водитель проблему сам, прежде чем предпринимать действия',
              'Немедленно звоните брокеру, объясняете поломку, просите сдвинуть pickup или уточняете, нужно ли им найти другого carrier\'а — затем помогаете водителю вызвать техпомощь и документируете всё',
              'Отменяете груз без уведомления брокера и ищете новый груз на завтра',
              'Просите водителя самому звонить брокеру — механические проблемы — ответственность водителя',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q12',
            text: 'Мини-кейс: 15:00. Ваш водитель только что сдал груз. Следующий забронированный груз забирается завтра в 7:00 утра, в 450 милях отсюда. У водителя 8 часов доступного HOS. Ехать сейчас или ждать до утра?',
            options: [
              'Ждать до утра — езда ночью опасна и не стоит риска',
              'Ехать сейчас — 450 миль со скоростью шоссе займут около 7 часов, что укладывается в 8-часовой лимит HOS. Приехав сегодня, водитель отдохнёт и будет готов к appointment в 7:00. Ожидание означает спешку утром или срыв pickup',
              'Проехать половину и отдохнуть — всегда разделять длинные поездки вне зависимости от доступности HOS',
              'Позвонить брокеру и попросить перенести pickup на полдень завтра',
            ],
            correctIndex: 1,
          },
        ],
      },
      simulation: true,
    },
    '1-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 1: Introduction to US Trucking</h2>
        <p>This practice test covers all material from Chapter 1: the roles of each participant in the freight supply chain, key industry terminology, and real dispatcher decision-making scenarios from the Demo lesson.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases. Each mini-case presents a real-world situation where you must choose the best professional course of action.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20 correct) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Roles in US freight: Shipper, Broker, Carrier, Dispatcher, Driver, Consignee</li>
          <li>Key terminology: RPM, BOL, HOS, CDL-A, detention, deadhead, load board, rate confirmation</li>
          <li>Dispatcher responsibilities: load selection by RPM, broker negotiation, driver management</li>
          <li>Real-world problem scenarios and professional decision-making</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 1: Введение в грузоперевозки США</h2>
        <p>Этот практический тест охватывает все материалы Главы 1: роль каждого участника цепочки поставок, ключевую терминологию отрасли и реальные сценарии принятия решений из блока Демо.</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных вопросов и 5 мини-кейсов. Мини-кейс описывает реальную рабочую ситуацию, где необходимо выбрать наилучший вариант действий.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20 правильных ответов) для прохождения практики по этой главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Роли в грузоперевозках США: Shipper, Broker, Carrier, Dispatcher, Driver, Consignee</li>
          <li>Ключевые термины: RPM, BOL, HOS, CDL-A, detention, deadhead, load board, rate confirmation</li>
          <li>Обязанности диспетчера: выбор груза по RPM, переговоры с брокером, управление водителем</li>
          <li>Реальные проблемные ситуации и профессиональное принятие решений</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 'pr-q1',
            text: 'Who acts as the intermediary between the shipper and the carrier in the US freight industry?',
            options: [
              'The driver — who physically transports the goods',
              'The broker — who connects shippers with carriers and earns a commission for the service',
              'The consignee — who receives the freight at the destination',
              'The owner-operator — who owns and drives their own truck',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q2',
            text: 'What is "deadhead" in trucking?',
            options: [
              'A load that pays above the current market rate',
              'Driving with an empty trailer — miles that generate no revenue for the carrier',
              'A specialized trailer type used for hazardous materials',
              'The final delivery destination of a shipment',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q3',
            text: 'What does RPM stand for and why is it the key metric when choosing a load?',
            options: [
              'Revenue Per Month — the carrier\'s total monthly earnings',
              'Rate Per Mile — the most accurate measure of profitability per mile driven, used to compare loads regardless of distance',
              'Route Planning Method — the algorithm used to optimize the route between pickup and delivery',
              'Revenue Per Movement — the total gross income from a single completed shipment',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q4',
            text: 'A dispatcher typically charges what percentage of the gross load rate as their service fee?',
            options: [
              '3–5% — the same commission level as a freight broker',
              '10% — the standard dispatcher commission in the US market',
              '20% — split equally between the dispatcher and the carrier',
              '15–18% — calculated based on mileage rather than the rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q5',
            text: 'What does a CDL-A (Commercial Driver\'s License — Class A) authorize a driver to operate?',
            options: [
              'Any vehicle weighing under 10,000 lbs, including cargo vans and light trucks',
              'Combination vehicles over 26,001 lbs gross vehicle weight, including semi-trucks with 53-ft dry van trailers',
              'Buses and passenger transport vehicles only, not freight trucks',
              'Forklifts and heavy warehouse equipment within a facility',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q6',
            text: 'Under FMCSA\'s Hours of Service (HOS) regulations, what is the maximum driving time allowed in a single day?',
            options: [
              '8 hours — the standard workday cap for all commercial drivers',
              '11 hours — maximum driving time within a 14-hour on-duty window',
              '14 hours — the total on-duty window including all activities, not just driving',
              '10 hours — the federal safety limit specifically for interstate trucking',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q7',
            text: 'What is a Bill of Lading (BOL) and what is its primary purpose?',
            options: [
              'A financial invoice the broker sends to the shipper listing all service fees and charges',
              'A legal document that serves as the contract between shipper and carrier, describing the freight, its condition, and terms of transport',
              'A driver\'s daily log required by FMCSA to track and verify hours of service compliance',
              'A government license required by the DOT to legally operate a commercial trucking company',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q8',
            text: 'What is "detention" in the context of freight transportation?',
            options: [
              'A penalty charged to the carrier for delivering a load past the scheduled delivery appointment',
              'A fee charged when a driver is held at a shipper or consignee beyond the standard free waiting time — typically 2 hours',
              'The formal process of booking and confirming a load on a digital load board platform',
              'A type of cargo insurance policy covering high-value or fragile shipments during transit',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q9',
            text: 'What is the primary responsibility of the Consignee in the freight supply chain?',
            options: [
              'Finding available carriers and posting load opportunities on load boards',
              'Negotiating freight rates with brokers and carriers on behalf of the shipper',
              'Receiving the delivered freight at the destination and signing the Proof of Delivery (POD)',
              'Maintaining and inspecting the trucks and equipment used for transporting goods',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q10',
            text: 'How does a freight broker earn money in the US trucking market?',
            options: [
              'Charging drivers a monthly subscription fee for access to exclusive load board listings',
              'Keeping the margin between what the shipper pays for the load and what the carrier actually receives',
              'Owning a fleet of trucks and leasing them to owner-operators at a daily rate',
              'Selling discounted fuel and maintenance services to carriers through negotiated contracts',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q11',
            text: 'At the start of a dispatcher\'s workday, what should be the FIRST action taken?',
            options: [
              'Immediately search the load board for the highest-paying available loads',
              'Call all broker contacts on the list to check for new load opportunities',
              'Check the current status of all active drivers — their location, load status, ETA, and any issues',
              'Review and send invoices for all loads completed the previous day',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q12',
            text: 'Two loads are available from Los Angeles, CA: Load A — LA to Phoenix, AZ: $950 / 370 miles. Load B — LA to Portland, OR: $2,400 / 1,050 miles. Which load has better RPM, and which is the stronger business decision overall?',
            options: [
              'Load A ($2.57/mi) has better RPM and is the better business decision',
              'Load B ($2.29/mi) has lower RPM but is the better business decision — higher total payout and Portland is a stronger outbound market',
              'Load A ($2.57/mi) has better RPM, but Load B is the better business decision — higher gross revenue and better lane positioning for the next load',
              'Both loads are equally profitable when all factors are considered',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q13',
            text: 'What does "book a load" mean in freight dispatching?',
            options: [
              'Recording a completed delivery in the carrier\'s internal tracking and invoicing system',
              'Officially confirming a shipment with a broker — agreeing on all details and receiving the signed Rate Confirmation document',
              'Finding and flagging a potential load on the load board before making the broker call',
              'Calculating and verifying the RPM before deciding whether a load is worth accepting',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q14',
            text: 'What is the purpose of a "check call" during active transit?',
            options: [
              'A verification call from the broker to the carrier before the Rate Confirmation is issued',
              'A regular call made by the dispatcher to the driver to confirm current location, ETA, and whether there are any issues',
              'A call from the shipper to the carrier to confirm that the load has been successfully picked up',
              'A mandatory daily compliance call required by FMCSA to report driver hours and route information',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q15',
            text: 'Which regulatory authority governs commercial driver safety standards, HOS rules, and CDL licensing requirements in the United States?',
            options: [
              'FAA (Federal Aviation Administration) — oversees safety across all modes of transportation',
              'FMCSA (Federal Motor Carrier Safety Administration) — specifically regulates commercial trucking and motor carrier safety',
              'NTSB (National Transportation Safety Board) — investigates major transportation accidents across all industries',
              'FTC (Federal Trade Commission) — regulates commerce, trade practices, and consumer protection',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q16',
            text: 'Mini-case: It\'s Monday morning. Your driver is empty in Dallas, TX and ready for a new load. You see three options on the load board:\n\nLoad A: Dallas, TX → Atlanta, GA | $2,100 | 780 miles | RPM: $2.69\nLoad B: Dallas, TX → Denver, CO | $1,400 | 920 miles | RPM: $1.52\nLoad C: Dallas, TX → Chicago, IL | $2,600 | 920 miles | RPM: $2.83\n\nWhich load do you choose?',
            options: [
              'Load A — shortest distance means the driver returns to Texas faster for the next load',
              'Load B — Denver is a strong outbound market, so finding the next load will be easy',
              'Load C — highest total payout ($2,600) AND best RPM ($2.83/mi). Chicago is a major freight hub with strong outbound options',
              'Load A — Atlanta has higher overall freight volume than Chicago, making it the better market',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q17',
            text: 'Mini-case: You call a broker about a load from Houston, TX to Nashville, TN — 640 miles. The broker opens with: "Rate is $1,750." Based on your market knowledge, the typical rate for this lane is $1,950–$2,100. What is the BEST response?',
            options: [
              'Accept $1,750 immediately — any confirmed load is better than sitting idle with an empty truck',
              '"I need at least $2,050 to make this lane work for us." — a professional counter within the realistic market range',
              '"We don\'t touch anything under $3,500 on Texas lanes." — set a high anchor to control the negotiation',
              'End the call and post your truck on the load board to attract inbound broker calls',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q18',
            text: 'Mini-case: Your driver arrived at a shipper at 9:00 AM for a scheduled pickup. The warehouse is slow and doesn\'t begin loading until 11:30 AM. The standard free waiting time is 2 hours. At what point does detention begin, and what is the correct dispatcher action?',
            options: [
              'Detention begins at 11:30 AM when loading starts. Tell the driver to wait patiently — delays happen',
              'Detention begins at 11:00 AM (2 hours after arrival at 9:00 AM). Notify the broker immediately, begin tracking detention time, and prepare to invoice if loading is not completed promptly',
              'Detention begins only after a full 4 hours of waiting — the 2-hour free window applies to each stage of the process separately',
              'Cancel the load — any shipper that causes a 2+ hour delay is not a reliable partner',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q19',
            text: 'Mini-case: It is 2:30 PM. Your driver just delivered in Memphis, TN with 8 hours of HOS remaining. Two loads are available:\n\nOption 1: Memphis, TN → Nashville, TN | $850 | 210 miles | RPM: $4.05\nOption 2: Memphis, TN → Atlanta, GA | $1,550 | 390 miles | RPM: $3.97\n\nBoth runs fit within available HOS. Which do you choose?',
            options: [
              'Option 1 (Nashville) — the RPM is higher at $4.05/mi, and RPM is always the deciding factor',
              'Option 2 (Atlanta) — higher gross revenue ($1,550 vs $850) AND Atlanta is a major freight hub with strong outbound options, making the next load easier to find',
              'Option 1 (Nashville) — the shorter run saves fuel and reduces driver fatigue for a more productive next day',
              'Neither — both RPMs are below $5.00, which is the minimum acceptable for short-haul loads',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q20',
            text: 'Mini-case: A broker calls you upset. Your driver delivered a load 4 hours late — the consignee had already closed, and re-delivery is scheduled for tomorrow. The broker was charged a $400 late fee by the shipper. You knew about the delay 5 hours before the delivery window but did not notify the broker. What was your critical mistake?',
            options: [
              'Accepting a load with a delivery window that was too tight for the actual distance and expected traffic conditions',
              'Failing to notify the broker immediately when the delay became known — proactive communication would have allowed the consignee to stay open, reschedule, or prepare, preventing the late fee entirely',
              'Hiring a driver who lacked sufficient route knowledge to avoid delays and traffic issues',
              'Failing to include a financial buffer in the negotiated rate to cover potential delays or penalty fees',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'pr-q1',
            text: 'Кто выступает посредником между грузоотправителем и перевозчиком в американской грузовой логистике?',
            options: [
              'Водитель — который физически перевозит груз из пункта А в пункт Б',
              'Брокер — который связывает грузоотправителей с перевозчиками и получает комиссию за услуги',
              'Грузополучатель — который принимает груз в месте назначения',
              'Owner-operator — который владеет собственным грузовиком и сам его водит',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q2',
            text: 'Что такое "deadhead" в грузоперевозках?',
            options: [
              'Груз с оплатой выше текущей рыночной ставки',
              'Движение с пустым прицепом — мили без груза, не приносящие перевозчику дохода',
              'Специализированный прицеп для перевозки опасных материалов',
              'Конечный пункт назначения при доставке груза',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q3',
            text: 'Что означает RPM и почему это ключевой показатель при выборе груза?',
            options: [
              'Revenue Per Month — ежемесячный общий доход перевозчика',
              'Rate Per Mile — наиболее точный показатель прибыльности на каждую пройденную милю, позволяющий сравнивать грузы независимо от расстояния',
              'Route Planning Method — алгоритм оптимизации маршрута между загрузкой и доставкой',
              'Revenue Per Movement — общий валовой доход от одной завершённой перевозки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q4',
            text: 'Какой стандартный процент от валовой ставки груза берёт диспетчер в качестве своей комиссии?',
            options: [
              '3–5% — такой же уровень комиссии, как у фрахтового брокера',
              '10% — стандартная комиссия диспетчера на рынке США',
              '20% — делится поровну между диспетчером и перевозчиком',
              '15–18% — рассчитывается исходя из миль, а не ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q5',
            text: 'Что даёт водителю лицензия CDL-A (Commercial Driver\'s License класса A)?',
            options: [
              'Право управлять любым транспортным средством весом до 10 000 фунтов, включая грузовые фургоны',
              'Право управлять составными транспортными средствами свыше 26 001 фунта полной массы, включая тягачи с прицепами 53 фута',
              'Право управлять только автобусами и пассажирским транспортом, но не грузовыми автомобилями',
              'Право управлять погрузчиками и тяжёлой складской техникой внутри предприятия',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q6',
            text: 'Согласно правилам HOS (Hours of Service) регулятора FMCSA, каково максимальное время вождения за один день?',
            options: [
              '8 часов — стандартный рабочий день для всех коммерческих водителей',
              '11 часов — максимальное время за рулём в рамках 14-часового рабочего окна',
              '14 часов — общее рабочее окно, включая все виды деятельности, а не только вождение',
              '10 часов — федеральный лимит безопасности конкретно для межштатных грузоперевозок',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q7',
            text: 'Что такое Bill of Lading (BOL) и для чего он служит?',
            options: [
              'Финансовый счёт, выставляемый брокером грузоотправителю за все услуги и сборы',
              'Юридический документ, который является договором между грузоотправителем и перевозчиком и описывает груз, его состояние и условия перевозки',
              'Ежедневный журнал водителя, обязательный по требованиям FMCSA для учёта рабочего времени',
              'Государственная лицензия, необходимая для законной работы транспортной компании',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q8',
            text: 'Что такое "detention" в контексте грузовых перевозок?',
            options: [
              'Штраф, выставляемый перевозчику за доставку груза позже согласованного срока',
              'Оплата за простой водителя у грузоотправителя или грузополучателя сверх бесплатного времени ожидания — обычно 2 часа',
              'Официальная процедура бронирования и подтверждения груза на электронной бирже',
              'Вид страхования груза для ценных или хрупких товаров во время транспортировки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q9',
            text: 'Какова основная задача грузополучателя (Consignee) в цепочке грузоперевозок?',
            options: [
              'Поиск доступных перевозчиков и размещение грузов на load board',
              'Переговоры о ставках с брокерами и перевозчиками от имени грузоотправителя',
              'Приём доставленного груза в пункте назначения и подписание Proof of Delivery (POD)',
              'Техническое обслуживание и инспекция грузовиков и оборудования, используемых при перевозке',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q10',
            text: 'Как зарабатывает фрахтовый брокер на рынке грузоперевозок США?',
            options: [
              'Взимает с водителей ежемесячную плату за доступ к эксклюзивным грузам на load board',
              'Оставляет разницу между суммой, которую платит грузоотправитель, и суммой, которую получает перевозчик',
              'Владеет парком грузовиков и сдаёт их в аренду owner-operators по дневной ставке',
              'Продаёт топливо и услуги технического обслуживания перевозчикам по льготным ценам',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q11',
            text: 'С чего диспетчер должен начинать рабочий день в первую очередь?',
            options: [
              'Сразу открыть load board и искать самые высокооплачиваемые грузы',
              'Обзвонить всех брокеров из контактного списка в поисках новых грузов',
              'Проверить текущий статус всех активных водителей — местоположение, статус груза, ETA и наличие проблем',
              'Проверить и отправить счета за все грузы, доставленные накануне',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q12',
            text: 'Из Лос-Анджелеса доступны два груза: Груз A — LA → Phoenix, AZ: $950 / 370 миль. Груз B — LA → Portland, OR: $2 400 / 1 050 миль. У какого груза лучше RPM и какой является более сильным бизнес-решением?',
            options: [
              'Груз A ($2.57/миль) — лучше RPM и лучше как бизнес-решение',
              'Груз B ($2.29/миль) — RPM ниже, но лучше как бизнес-решение из-за высокой общей выплаты и сильного рынка Портленда',
              'Груз A ($2.57/миль) — лучше RPM, но Груз B — лучшее бизнес-решение из-за более высокого валового дохода и лучшей позиции для следующего груза',
              'Оба груза одинаково выгодны при учёте всех факторов',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q13',
            text: 'Что означает "book a load" в работе диспетчера?',
            options: [
              'Внесение данных о завершённой доставке во внутреннюю систему учёта и выставления счетов',
              'Официальное подтверждение груза с брокером — согласование всех деталей и получение подписанного Rate Confirmation',
              'Нахождение и отметка потенциального груза на load board перед звонком брокеру',
              'Расчёт и проверка RPM перед принятием решения о том, стоит ли брать груз',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q14',
            text: 'Какова цель "check call" во время активной перевозки?',
            options: [
              'Проверочный звонок от брокера к перевозчику перед выставлением Rate Confirmation',
              'Регулярный звонок диспетчера водителю для уточнения текущего местоположения, ETA и наличия каких-либо проблем',
              'Звонок от грузоотправителя перевозчику для подтверждения успешной загрузки',
              'Обязательный ежедневный звонок в FMCSA для отчёта о часах вождения и маршруте',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q15',
            text: 'Какой регуляторный орган США отвечает за стандарты безопасности коммерческих водителей, правила HOS и требования к лицензии CDL?',
            options: [
              'FAA (Федеральное управление гражданской авиации) — надзор за безопасностью всех видов транспорта',
              'FMCSA (Федеральное управление безопасности автомобильных перевозчиков) — регулирует именно коммерческие грузоперевозки',
              'NTSB (Национальный совет по безопасности на транспорте) — расследует крупные транспортные происшествия',
              'FTC (Федеральная торговая комиссия) — регулирует торговую деятельность и защиту потребителей',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q16',
            text: 'Мини-кейс: Понедельник, утро. Ваш водитель свободен в Далласе, TX и готов к следующему грузу. На load board три варианта:\n\nГруз A: Dallas, TX → Atlanta, GA | $2 100 | 780 миль | RPM: $2.69\nГруз B: Dallas, TX → Denver, CO | $1 400 | 920 миль | RPM: $1.52\nГруз C: Dallas, TX → Chicago, IL | $2 600 | 920 миль | RPM: $2.83\n\nКакой груз выбрать?',
            options: [
              'Груз A — кратчайшее расстояние означает, что водитель быстрее вернётся в Техас',
              'Груз B — Денвер — сильный рынок грузов, следующий груз найти будет легко',
              'Груз C — самая высокая общая ставка ($2 600) И лучший RPM ($2.83/миль). Чикаго — крупный транспортный узел с хорошим рынком исходящих грузов',
              'Груз A — Атланта имеет больший общий объём грузов, чем Чикаго',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q17',
            text: 'Мини-кейс: Вы звоните брокеру по грузу Houston, TX → Nashville, TN (640 миль). Брокер открывает переговоры словами: "Ставка $1 750." По вашему опыту, рыночная ставка для этого маршрута — $1 950–$2 100. Какой ответ оптимален?',
            options: [
              'Согласиться на $1 750 сразу — любой подтверждённый груз лучше простоя',
              '"Нам нужно минимум $2 050, чтобы этот маршрут был для нас выгодным." — профессиональный встречный оффер в реалистичном рыночном диапазоне',
              '"Мы не берём ничего ниже $3 500 по техасским маршрутам." — установить высокую начальную позицию для переговоров',
              'Завершить звонок и разместить грузовик на load board, чтобы привлечь входящие звонки от брокеров',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q18',
            text: 'Мини-кейс: Водитель прибыл на склад грузоотправителя в 9:00 на плановую загрузку. Склад работает медленно и начинает погрузку только в 11:30. Стандартное бесплатное время ожидания — 2 часа. С какого момента начинается detention и каковы правильные действия диспетчера?',
            options: [
              'Detention начинается в 11:30, когда начинается погрузка. Скажите водителю терпеливо ждать — задержки бывают',
              'Detention начинается в 11:00 (2 часа после прибытия в 9:00). Немедленно уведомить брокера, начать фиксировать время простоя и подготовить счёт, если погрузка не завершится оперативно',
              'Detention начинается только после 4 часов ожидания — 2 часа бесплатного времени применяются к каждому этапу отдельно',
              'Отменить груз — любой грузоотправитель, задерживающий погрузку на 2+ часа, не является надёжным партнёром',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q19',
            text: 'Мини-кейс: 14:30. Водитель только что доставил груз в Мемфисе, TN. Доступно 8 часов HOS. На load board два варианта:\n\nВариант 1: Memphis, TN → Nashville, TN | $850 | 210 миль | RPM: $4.05\nВариант 2: Memphis, TN → Atlanta, GA | $1 550 | 390 миль | RPM: $3.97\n\nОба рейса укладываются в доступные часы HOS. Какой груз выбрать?',
            options: [
              'Вариант 1 (Нэшвилл) — RPM выше ($4.05/миль), а RPM всегда является решающим фактором',
              'Вариант 2 (Атланта) — выше общая выплата ($1 550 против $850), а Атланта — крупный транспортный узел с сильным рынком для следующего груза',
              'Вариант 1 (Нэшвилл) — более короткий рейс экономит топливо и снижает усталость водителя',
              'Ни один — оба RPM ниже $5.00, что является минимально приемлемым уровнем для коротких рейсов',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q20',
            text: 'Мини-кейс: Брокер звонит с претензией. Ваш водитель опоздал на 4 часа, грузополучатель к тому времени уже закрылся, доставка перенесена на завтра. Брокеру выставили штраф $400. Вы знали о задержке за 5 часов до окна доставки, но брокера не уведомляли. Какова ваша ключевая ошибка?',
            options: [
              'Принятие груза с окном доставки, слишком узким для данного расстояния и возможных задержек',
              'Непредупреждение брокера сразу, как только стала известна задержка — своевременное сообщение позволило бы грузополучателю остаться, перенести приёмку или подготовиться, полностью предотвратив штраф',
              'Найм водителя с недостаточным знанием маршрута для избежания задержек',
              'Отсутствие финансового буфера в согласованной ставке на случай задержек и штрафов',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '2-1': {
      type: 'text',
      body: `
        <h2>Geography & Time Zones: The Dispatcher's Map</h2>
        <p>The United States stretches over 2,800 miles from coast to coast. For a freight dispatcher, understanding this geography is not optional — it directly determines how you plan loads, calculate delivery times, and communicate across the country.</p>
        <p>One of the most common and costly mistakes new dispatchers make is ignoring time zones. The US spans four main time zones, which means when a broker says "pickup at 8 AM," you need to know <em>whose</em> 8 AM that is. A driver in Los Angeles is on Pacific Time. A broker in New York is on Eastern Time. That's a 3-hour gap that causes missed appointments every single day.</p>
        <blockquote><strong>Key insight:</strong> Geography knowledge turns a dispatcher from someone who books loads into a strategic planner who knows which lanes are profitable, which markets have return freight, and how to keep drivers moving efficiently.</blockquote>

        <h3>The Four US Time Zones</h3>
        <p>From west to east, the four time zones you'll work with every day are:</p>
        <ul>
          <li><strong>Pacific Time (PT)</strong> — Los Angeles, Seattle, San Francisco, Portland. UTC-8 in winter, UTC-7 in summer (DST).</li>
          <li><strong>Mountain Time (MT)</strong> — Denver, Salt Lake City, Albuquerque. UTC-7 in winter, UTC-6 in summer. <strong>Exception: Arizona does NOT observe DST — it stays at UTC-7 year-round.</strong></li>
          <li><strong>Central Time (CT)</strong> — Chicago, Dallas, Houston, Memphis, Kansas City. UTC-6 in winter, UTC-5 in summer.</li>
          <li><strong>Eastern Time (ET)</strong> — New York, Miami, Atlanta, Boston, Philadelphia. UTC-5 in winter, UTC-4 in summer.</li>
        </ul>
        <p>The rule: moving east — the clock moves forward. Moving west — the clock moves back. If it's noon in Los Angeles (PT), it's 3:00 PM in New York (ET).</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="Map of US time zones" loading="lazy" />
          <figcaption>US Time Zones — Pacific (PT), Mountain (MT), Central (CT), Eastern (ET). Note: Arizona stays on MT year-round with no DST</figcaption>
        </figure>

        <h3>Time Zone Errors Cost Real Money</h3>
        <p>Consider this: you're dispatching from Chicago (CT) and a broker in Atlanta (ET) says the pickup appointment is at 7:00 AM tomorrow. The shipper is in Phoenix, AZ — which is Mountain Time with no DST. In winter that means Phoenix is 1 hour behind CT and 2 hours behind ET. If you write "7:00 AM" without specifying the time zone, your driver might show up 2 hours early or 2 hours late.</p>
        <p>The professional standard: always communicate pickup and delivery times in the <strong>local time zone of the pickup or delivery location</strong>. The driver will be physically at that location — they need to know local time.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="US Interstate Highway System" loading="lazy" />
          <figcaption>The US Interstate Highway network — every freight appointment spans this map, making time zone awareness essential for every dispatcher</figcaption>
        </figure>

        <h3>Geography Shapes Freight Rates</h3>
        <p>Not all regions generate equal amounts of freight. California, Texas, the Midwest, and the Northeast are freight powerhouses — loads are plentiful, competition is high, and rates follow market dynamics. In contrast, rural areas like Montana, Wyoming, or parts of the Deep South have far less freight activity. Delivering into these low-volume regions often means struggling to find a return load, leading to deadhead miles and lost revenue.</p>
        <p>Understanding the <em>flow</em> of freight — where loads originate, where they go, and where trucks get "stuck" — is the foundation of profitable dispatching. You'll learn this in detail in the Theory and Demo lessons ahead.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="18-wheeler on US highway" loading="lazy" />
          <figcaption>An 18-wheeler crossing state lines — this is what the dispatcher manages remotely, coordinating every mile across time zones and regions</figcaption>
        </figure>
      `,
      bodyRu: `
        <h2>География и часовые пояса: карта диспетчера</h2>
        <p>США простираются более чем на 4 500 км от побережья до побережья. Для диспетчера грузоперевозок знание этой географии обязательно — оно напрямую влияет на то, как вы планируете грузы, рассчитываете время доставки и координируете работу по всей стране.</p>
        <p>Одна из самых распространённых и дорогостоящих ошибок новых диспетчеров — игнорирование часовых поясов. США охватывают четыре основных часовых пояса, поэтому когда брокер говорит "загрузка в 8 утра", нужно чётко понимать, <em>чьи</em> это 8 утра. Водитель в Лос-Анджелесе работает по Pacific Time. Брокер в Нью-Йорке — по Eastern Time. Это разница в 3 часа, из-за которой ежедневно срываются appointments.</p>
        <blockquote><strong>Ключевая мысль:</strong> Знание географии превращает диспетчера из человека, который "бронирует грузы", в стратегического планировщика, который знает, какие маршруты прибыльны, где есть обратные грузы и как удерживать водителей в движении.</blockquote>

        <h3>Четыре часовых пояса США</h3>
        <p>С запада на восток четыре часовых пояса, с которыми вы будете работать каждый день:</p>
        <ul>
          <li><strong>Pacific Time (PT)</strong> — Лос-Анджелес, Сиэтл, Сан-Франциско, Портленд. UTC-8 зимой, UTC-7 летом (DST).</li>
          <li><strong>Mountain Time (MT)</strong> — Денвер, Солт-Лейк-Сити, Альбукерке. UTC-7 зимой, UTC-6 летом. <strong>Исключение: Аризона НЕ соблюдает DST — остаётся на UTC-7 круглый год.</strong></li>
          <li><strong>Central Time (CT)</strong> — Чикаго, Даллас, Хьюстон, Мемфис, Канзас-Сити. UTC-6 зимой, UTC-5 летом.</li>
          <li><strong>Eastern Time (ET)</strong> — Нью-Йорк, Майами, Атланта, Бостон, Филадельфия. UTC-5 зимой, UTC-4 летом.</li>
        </ul>
        <p>Правило: движение на восток — часы идут вперёд. На запад — назад. Если в Лос-Анджелесе (PT) полдень, в Нью-Йорке (ET) уже 15:00.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="Карта часовых поясов США" loading="lazy" />
          <figcaption>Часовые пояса США — Pacific (PT), Mountain (MT), Central (CT), Eastern (ET). Аризона остаётся на MT круглый год без DST</figcaption>
        </figure>

        <h3>Ошибки с часовыми поясами стоят денег</h3>
        <p>Представьте: вы диспетчер в Чикаго (CT), брокер в Атланте (ET) говорит, что загрузка завтра в 7:00 утра. Грузоотправитель — в Финиксе, Аризона (MT без DST). Зимой это означает, что Финикс отстаёт от CT на 1 час и от ET на 2 часа. Если написать просто "7:00 утра" без указания часового пояса, водитель может приехать на 2 часа раньше или позже.</p>
        <p>Профессиональный стандарт: всегда указывайте время загрузки и доставки в <strong>местном часовом поясе места загрузки или доставки</strong>. Водитель будет физически находиться там — ему нужно знать местное время.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="Система межштатных шоссе США" loading="lazy" />
          <figcaption>Сеть межштатных шоссе США — каждый appointment охватывает эту карту, поэтому знание часовых поясов критично для каждого диспетчера</figcaption>
        </figure>

        <h3>География формирует ставки</h3>
        <p>Не все регионы генерируют одинаковое количество грузов. Калифорния, Техас, Средний Запад и Северо-Восток — это центры грузовой активности. Сельские районы, такие как Монтана, Вайоминг или части Глубокого Юга, значительно уступают им. Доставка в низкообъёмные регионы часто означает трудности с поиском обратного груза — это ведёт к deadhead и потере дохода.</p>
        <p>Понимание "потока" грузов — откуда они отправляются, куда идут и где застревают грузовики — это основа прибыльного диспетчинга. В следующих уроках вы изучите это детально.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="Грузовик пересекает штаты США" loading="lazy" />
          <figcaption>18-wheeler пересекает границу штата — именно этим управляет диспетчер удалённо, координируя каждую милю через часовые пояса и регионы</figcaption>
        </figure>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-in-q1',
            text: 'How many hours ahead is Eastern Time (ET) compared to Pacific Time (PT)?',
            options: ['1 hour', '2 hours', '3 hours', '4 hours'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q2',
            text: 'It is 11:00 AM in Los Angeles, CA (Pacific Time). What time is it in Dallas, TX (Central Time)?',
            options: ['10:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q3',
            text: 'Which US state does NOT observe Daylight Saving Time and stays on Mountain Time (UTC-7) year-round?',
            options: ['Colorado', 'Arizona', 'Utah', 'New Mexico'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q4',
            text: 'When moving from west to east across US time zones, what happens to the clock?',
            options: ['It moves backward (earlier)', 'It moves forward (later)', 'It stays the same', 'It depends on DST'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q5',
            text: 'What is a "freight desert" in dispatching?',
            options: [
              'A route passing through desert states like Arizona or Nevada',
              'A region with low freight volume where finding a return load is difficult, leading to deadhead miles',
              'A dry van load in hot weather states',
              'A load paying below market rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q6',
            text: 'Your driver delivers in Seattle, WA (PT) at 4:00 PM PT. What time is it simultaneously in Atlanta, GA (ET)?',
            options: ['1:00 PM ET', '4:00 PM ET', '6:00 PM ET', '7:00 PM ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-in-q7',
            text: 'Which city is in the Central Time (CT) zone?',
            options: ['Los Angeles, CA', 'Denver, CO', 'Memphis, TN', 'Philadelphia, PA'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q8',
            text: 'What is the professional standard for communicating pickup and delivery appointment times?',
            options: [
              'Always use Eastern Time — it is the standard business time zone in the US',
              'Always use UTC to avoid confusion',
              'Always use the local time zone of the pickup or delivery location',
              'Always use the dispatcher\'s local time zone',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q9',
            text: 'What are the four main US time zones in order from west to east?',
            options: [
              'Pacific, Mountain, Central, Eastern',
              'Western, Central, Eastern, Atlantic',
              'Pacific, Rockies, Midwest, Eastern',
              'Pacific, Desert, Plains, Atlantic',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-in-q10',
            text: 'It is 3:00 PM Pacific Time. A broker in New York (ET) asks you to confirm the driver\'s ETA. What ET time do you report if the driver is 30 minutes away from delivery?',
            options: ['3:30 PM ET', '5:30 PM ET', '6:30 PM ET', '7:30 PM ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q11',
            text: 'Mini-case: You dispatch from Miami, FL (ET) in January. Your driver picks up in Phoenix, AZ. The shipper\'s appointment is 10:00 AM local Phoenix time. Phoenix is on Mountain Time (no DST, always UTC-7). Eastern Time in January is UTC-5. What time do you schedule this in your ET calendar?',
            options: ['8:00 AM ET', '10:00 AM ET', '12:00 PM ET', '1:00 PM ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q12',
            text: 'Mini-case: You book a load from Los Angeles, CA (PT) to Boston, MA (ET). The broker says "delivery appointment Monday 8:00 AM ET." Your driver asks what time to show up. What is the correct answer?',
            options: [
              '"8:00 AM PT" — adjust to the driver\'s home time zone',
              '"8:00 AM ET" — the appointment is at Boston\'s local time, and the driver will be in ET when they deliver',
              '"5:00 AM PT" — give the Pacific equivalent so the driver can plan their drive',
              '"11:00 AM ET" — add 3 hours for the coast-to-coast difference',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-in-q1',
            text: 'На сколько часов Eastern Time (ET) опережает Pacific Time (PT)?',
            options: ['На 1 час', 'На 2 часа', 'На 3 часа', 'На 4 часа'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q2',
            text: 'В Лос-Анджелесе, CA (Pacific Time) 11:00 утра. Который час в Далласе, TX (Central Time)?',
            options: ['10:00', '12:00', '13:00', '14:00'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q3',
            text: 'Какой штат США НЕ соблюдает летнее время и остаётся на Mountain Time (UTC-7) круглый год?',
            options: ['Колорадо', 'Аризона', 'Юта', 'Нью-Мексико'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q4',
            text: 'При движении с запада на восток через часовые пояса США что происходит со временем?',
            options: ['Время сдвигается назад (раньше)', 'Время сдвигается вперёд (позже)', 'Время остаётся прежним', 'Зависит от DST'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q5',
            text: 'Что такое "freight desert" (грузовая пустыня) в диспетчинге?',
            options: [
              'Маршрут через пустынные штаты — Аризону или Неваду',
              'Регион с низким объёмом грузов, где трудно найти обратный груз, что ведёт к холостым милям',
              'Груз на dry van в жарких штатах',
              'Груз с оплатой ниже рыночной ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q6',
            text: 'Водитель доставляет груз в Сиэтле, WA (PT) в 16:00 PT. Который час одновременно в Атланте, GA (ET)?',
            options: ['13:00 ET', '16:00 ET', '19:00 ET', '20:00 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q7',
            text: 'Какой город находится в часовом поясе Central Time (CT)?',
            options: ['Лос-Анджелес, CA', 'Денвер, CO', 'Мемфис, TN', 'Филадельфия, PA'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q8',
            text: 'Каков профессиональный стандарт при указании времени загрузки и доставки?',
            options: [
              'Всегда использовать Eastern Time — это стандартное деловое время в США',
              'Всегда использовать UTC во избежание путаницы',
              'Всегда указывать местное время места загрузки или доставки',
              'Всегда использовать часовой пояс диспетчера',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q9',
            text: 'Назовите четыре основных часовых пояса США с запада на восток.',
            options: [
              'Pacific, Mountain, Central, Eastern',
              'Western, Central, Eastern, Atlantic',
              'Pacific, Rockies, Midwest, Eastern',
              'Pacific, Desert, Plains, Atlantic',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-in-q10',
            text: 'Сейчас 15:00 Pacific Time. Брокер в Нью-Йорке (ET) просит подтвердить ETA водителя. Водитель в 30 минутах от доставки. Какое время ET вы называете?',
            options: ['15:30 ET', '17:30 ET', '18:30 ET', '19:30 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q11',
            text: 'Мини-кейс: Вы диспетчер в Майами, FL (ET), январь. Водитель забирает груз в Финиксе, AZ. Appointment у грузоотправителя — 10:00 утра по местному времени Финикса (MT, без DST, всегда UTC-7). Eastern Time в январе — UTC-5. В какое время ET вы ставите это в своём календаре?',
            options: ['8:00 ET', '10:00 ET', '12:00 ET', '13:00 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q12',
            text: 'Мини-кейс: Вы бронируете груз из Лос-Анджелеса, CA (PT) в Бостон, MA (ET). Брокер говорит: "Delivery appointment понедельник, 8:00 утра ET." Водитель спрашивает, в котором часу ему приехать. Что правильно ответить?',
            options: [
              '"8:00 PT" — привести к домашнему часовому поясу водителя',
              '"8:00 ET" — appointment по местному времени Бостона; когда водитель приедет в Бостон, он будет в ET',
              '"5:00 PT" — дать эквивалент в Pacific Time для планирования поездки',
              '"11:00 ET" — прибавить 3 часа на разницу между побережьями',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '2-2': {
      type: 'text',
      body: `
        <h2>US Geography for Freight Dispatchers</h2>
        <p>A dispatcher who understands US geography doesn't just book loads — they build strategy. Knowing which regions generate freight, which highways connect them, and how seasonal demand shifts gives you a decisive edge in planning profitable runs.</p>

        <h3>US Regions and Their Freight Profiles</h3>
        <p><strong>West Coast (CA, OR, WA)</strong> — One of the most active freight markets in the US. Los Angeles and the Ports of LA/Long Beach handle a massive share of US imports. Outbound from California is strong — loads go east constantly. However, inbound to California often pays lower rates because so many trucks are trying to get there. Seattle is a strong market but can be soft for outbound eastbound.</p>
        <p><strong>Mountain West (CO, UT, NV, MT, WY, ID)</strong> — Lower freight density overall. Denver (CO) is the main hub. Nevada has Las Vegas and Reno with decent activity. Montana and Wyoming are near-freight deserts — difficult to find return loads after a delivery there. Salt Lake City (UT) is a growing distribution center.</p>
        <p><strong>Southwest (TX, NM, AZ)</strong> — Texas is one of the top freight states in the country. Dallas/Fort Worth and Houston are massive distribution hubs with constant load activity. The TX→Midwest and TX→Southeast corridors are highly active. Arizona (Phoenix) is moderate. New Mexico is limited.</p>
        <p><strong>Midwest (IL, OH, IN, MI, MN, WI, MO, KS)</strong> — Chicago, IL is the undisputed freight capital of the US — the intersection of almost every major highway and rail line. Columbus, OH and Indianapolis, IN are major distribution centers. Memphis, TN (just south of the Midwest) is home to FedEx's global hub and one of the busiest logistics centers in the world.</p>
        <p><strong>Southeast (GA, FL, NC, SC, AL, MS)</strong> — Atlanta, GA is the dominant hub, a major Delta Air Lines hub and distribution center for the Southeast. Florida generates strong inbound freight but can be tricky for outbound (loads go in easily, finding return loads is sometimes challenging). Charlotte, NC is a growing freight market.</p>
        <p><strong>Northeast (NY, NJ, PA, MA, CT)</strong> — The densest population in the US means constant freight demand. New York/New Jersey is a top freight destination. However, operating in the Northeast means tight urban deliveries, tolls, and congestion. Getting OUT of the Northeast with good rates is typically easy — it's a strong outbound market.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="US regions and time zones map" loading="lazy" />
          <figcaption>US regions overlaid with time zones — when a broker says "pickup at 8 AM," always confirm which time zone applies to the shipper's location</figcaption>
        </figure>

        <h3>Major Interstate Highways</h3>
        <p>Knowing the main highways helps you understand routes, distances, and potential issues:</p>
        <ul>
          <li><strong>I-5</strong> — North-south on the West Coast: Seattle → Portland → Sacramento → Los Angeles → San Diego. The spine of West Coast freight.</li>
          <li><strong>I-10</strong> — East-west southern corridor: Los Angeles → Phoenix → El Paso → San Antonio → Houston → New Orleans → Jacksonville, FL.</li>
          <li><strong>I-40</strong> — East-west middle route: Los Angeles → Albuquerque → Oklahoma City → Memphis → Greensboro, NC. The "modern Route 66."</li>
          <li><strong>I-70</strong> — East-west through the Rockies: Denver → Kansas City → St. Louis → Indianapolis → Columbus. Important warning: I-70 through the Rockies west of Denver has extremely challenging mountain passes — dangerous in winter conditions.</li>
          <li><strong>I-80</strong> — Northern east-west corridor: San Francisco → Reno → Salt Lake City → Cheyenne → Omaha → Chicago → New York.</li>
          <li><strong>I-90</strong> — Northernmost east-west: Seattle → Butte → Sioux Falls → Chicago → Boston. Long stretches through harsh winter weather.</li>
          <li><strong>I-95</strong> — East Coast north-south: Miami → Jacksonville → Richmond → Philadelphia → New York → Boston. The most congested highway in the US — plan for heavy traffic.</li>
          <li><strong>I-35</strong> — North-south through the center: San Antonio → Dallas → Oklahoma City → Kansas City → Minneapolis.</li>
        </ul>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="US Interstate Highway System map" loading="lazy" />
          <figcaption>The US Interstate Highway System — learn these corridors and you'll understand why certain freight lanes are profitable and others are traps</figcaption>
        </figure>

        <h3>Key Freight Corridors</h3>
        <p>A <strong>lane</strong> is a specific origin-destination pair. Some lanes are consistently strong — high demand, competitive rates. Others are one-directional (loads go one way easily but finding a return is hard).</p>
        <p><strong>Strong bidirectional lanes:</strong> CA ↔ TX, TX ↔ Midwest (Chicago), Southeast ↔ Northeast, Midwest ↔ Mid-Atlantic.</p>
        <p><strong>Strong outbound, weaker inbound:</strong> CA outbound east (strong), CA inbound from east (soft — too many trucks want to go to CA). FL inbound (easy), FL outbound (can be soft off-season).</p>
        <blockquote><strong>Pro tip:</strong> After delivering in a soft market, immediately start searching for the next load BEFORE the driver arrives. Every hour a truck sits empty is lost money.</blockquote>

        <h3>Seasonal Freight Patterns</h3>
        <p><strong>Peak season (October–December)</strong> — Holiday retail shipping drives a massive surge in freight demand. Rates climb across all lanes. Capacity tightens. This is when you can negotiate the best rates.</p>
        <p><strong>Produce season (April–September)</strong> — Fresh produce from California, Florida, and Texas drives heavy reefer freight. Dry van also picks up. Summer construction adds flatbed demand.</p>
        <p><strong>Slow season (January–February)</strong> — Post-holiday lull. Rates soften, loads are harder to find. Efficient dispatchers plan their lane positioning carefully to stay in active markets.</p>

        <h3>California Regulations (CARB)</h3>
        <p>California enforces strict diesel emissions standards through CARB (California Air Resources Board). Trucks operating in California must meet specific emissions requirements. Older trucks that don't comply cannot legally operate in California — which affects which carriers can serve CA lanes and can limit your options when booking loads into or out of the state.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck on US freight route" loading="lazy" />
          <figcaption>A box truck covering a regional freight lane — understanding which corridors and states your equipment can legally operate in is part of every dispatcher's job</figcaption>
        </figure>
      `,
      bodyRu: `
        <h2>География США для диспетчеров грузоперевозок</h2>
        <p>Диспетчер, понимающий географию США, не просто бронирует грузы — он строит стратегию. Знание того, какие регионы генерируют грузы, какие шоссе их соединяют и как меняется сезонный спрос, даёт решающее преимущество в планировании прибыльных рейсов.</p>

        <h3>Регионы США и их грузовые профили</h3>
        <p><strong>Западное побережье (CA, OR, WA)</strong> — Один из наиболее активных рынков грузов в США. Лос-Анджелес и порты LA/Long Beach обрабатывают огромную долю американского импорта. Исходящий поток из Калифорнии — сильный: грузы постоянно уходят на восток. Однако входящий в Калифорнию поток нередко оплачивается ниже, потому что слишком много перевозчиков стремится туда попасть.</p>
        <p><strong>Mountain West (CO, UT, NV, MT, WY, ID)</strong> — Невысокая плотность грузов. Главный хаб — Денвер (CO). Монтана и Вайоминг — почти "грузовые пустыни": после доставки туда найти обратный груз крайне сложно. Солт-Лейк-Сити (UT) — растущий дистрибьюторский центр.</p>
        <p><strong>Юго-Запад (TX, NM, AZ)</strong> — Техас — один из ведущих штатов по объёму грузов. Даллас/Форт-Уэрт и Хьюстон — огромные дистрибьюторские хабы с постоянной активностью. Коридоры TX→Midwest и TX→Southeast высоко востребованы. Аризона (Финикс) — умеренная активность. Нью-Мексико — ограниченная.</p>
        <p><strong>Средний Запад (IL, OH, IN, MI, MN, WI, MO, KS)</strong> — Чикаго (IL) — бесспорная грузовая столица США, пересечение практически всех крупных шоссе и железных дорог. Колумбус (OH) и Индианаполис (IN) — крупные дистрибьюторские центры. Мемфис (TN) — дом глобального хаба FedEx и один из самых загруженных логистических центров мира.</p>
        <p><strong>Юго-Восток (GA, FL, NC, SC, AL, MS)</strong> — Атланта (GA) — доминирующий хаб. Флорида генерирует сильный входящий поток, но поиск обратных грузов бывает затруднён в несезон. Шарлотт (NC) — растущий рынок.</p>
        <p><strong>Северо-Восток (NY, NJ, PA, MA, CT)</strong> — Самая высокая плотность населения в США означает постоянный спрос на грузы. Нью-Йорк/Нью-Джерси — топовое направление. Исходящие из Северо-Востока грузы обычно хорошо оплачиваются — сильный рынок.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="Карта регионов и часовых поясов США" loading="lazy" />
          <figcaption>Регионы США с наложением часовых поясов — всегда уточняйте, по какому времени назначен pickup у грузоотправителя</figcaption>
        </figure>

        <h3>Основные межштатные шоссе</h3>
        <ul>
          <li><strong>I-5</strong> — Север-Юг по Западному побережью: Сиэтл → Портленд → Сакраменто → Лос-Анджелес → Сан-Диего.</li>
          <li><strong>I-10</strong> — Восток-Запад, южный коридор: Лос-Анджелес → Финикс → Эль-Пасо → Сан-Антонио → Хьюстон → Новый Орлеан → Джэксонвилл.</li>
          <li><strong>I-40</strong> — Восток-Запад, средний маршрут: Лос-Анджелес → Альбукерке → Оклахома-Сити → Мемфис → Северная Каролина. "Современное шоссе Route 66."</li>
          <li><strong>I-70</strong> — Через Скалистые горы: Денвер → Канзас-Сити → Сент-Луис → Индианаполис → Колумбус. <strong>Внимание: I-70 к западу от Денвера содержит опасные горные перевалы — зимой крайне сложно.</strong></li>
          <li><strong>I-80</strong> — Северный восток-запад: Сан-Франциско → Рино → Солт-Лейк-Сити → Шайенн → Омаха → Чикаго → Нью-Йорк.</li>
          <li><strong>I-95</strong> — Восточное побережье север-юг: Майами → Джэксонвилл → Ричмонд → Филадельфия → Нью-Йорк → Бостон. Самое загруженное шоссе США.</li>
          <li><strong>I-35</strong> — Север-Юг через центр: Сан-Антонио → Даллас → Оклахома-Сити → Канзас-Сити → Миннеаполис.</li>
        </ul>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="Система межштатных шоссе США" loading="lazy" />
          <figcaption>Система межштатных шоссе США — знание этих коридоров объясняет, почему одни маршруты прибыльны, а другие — ловушка для водителя</figcaption>
        </figure>

        <h3>Ключевые грузовые коридоры</h3>
        <p><strong>Маршрут (lane)</strong> — конкретная пара "откуда → куда". Некоторые маршруты стабильно сильные с обеих сторон. Другие — односторонние.</p>
        <p><strong>Сильные двусторонние маршруты:</strong> CA ↔ TX, TX ↔ Midwest (Чикаго), Southeast ↔ Northeast, Midwest ↔ Mid-Atlantic.</p>
        <p><strong>Сильный исходящий, слабый входящий:</strong> Калифорния — сильный исходящий восток; входящий из востока — мягкий. Флорида — входящий сильный, исходящий в несезон — слабый.</p>
        <blockquote><strong>Совет профи:</strong> После доставки в слабый рынок немедленно начинайте поиск следующего груза — ещё до того, как водитель приедет. Каждый час простоя — потерянные деньги.</blockquote>

        <h3>Сезонные закономерности</h3>
        <p><strong>Пиковый сезон (октябрь–декабрь)</strong> — Предпраздничные отгрузки резко поднимают спрос. Ставки растут. Это лучшее время для переговоров.</p>
        <p><strong>Сезон продуктов питания (апрель–сентябрь)</strong> — Свежие продукты из Калифорнии, Флориды и Техаса создают мощный поток рефрижераторных грузов. Dry van тоже растёт.</p>
        <p><strong>Мёртвый сезон (январь–февраль)</strong> — Послепраздничный спад. Ставки падают, грузы труднее найти. Опытные диспетчеры заранее позиционируют водителей в активных рынках.</p>

        <h3>Регулирование Калифорнии (CARB)</h3>
        <p>Калифорния применяет жёсткие стандарты выбросов дизельных двигателей через CARB (California Air Resources Board). Грузовики, работающие в Калифорнии, должны соответствовать определённым требованиям по выбросам. Старые грузовики, не соответствующие нормам, не могут легально работать в штате — это ограничивает список перевозчиков, способных обслуживать калифорнийские маршруты.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck на маршруте грузоперевозки" loading="lazy" />
          <figcaption>Box truck на региональном маршруте — понимание коридоров и требований по выбросам в каждом штате входит в работу каждого диспетчера</figcaption>
        </figure>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-th-q1',
            text: 'Which city is considered the most important freight hub in the United States due to its central location and highway network?',
            options: ['Dallas, TX', 'Chicago, IL', 'Los Angeles, CA', 'Atlanta, GA'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q2',
            text: 'What is a "hot market" in freight dispatching?',
            options: [
              'A region with very high temperatures requiring reefer trailers',
              'A market where freight demand exceeds available trucks, resulting in higher rates',
              'A broker who consistently pays above-market rates',
              'A lane that is only profitable in summer',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q3',
            text: 'Which Interstate highway runs north-south along the West Coast, connecting Seattle to Los Angeles?',
            options: ['I-80', 'I-40', 'I-5', 'I-10'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q4',
            text: 'What is the key practical concern when routing a driver through I-70 west of Denver, CO in December?',
            options: [
              'Heavy truck traffic and construction delays',
              'I-70 west of Denver goes through dangerous mountain passes that become extremely hazardous in winter weather',
              'There are no truck stops on this section of I-70',
              'California CARB regulations apply on this stretch',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q5',
            text: 'Which region of the US is generally considered a near-"freight desert" — very difficult to find outbound loads?',
            options: [
              'Chicago, IL and the Midwest corridor',
              'Dallas/Fort Worth, TX',
              'Rural Montana or Wyoming',
              'Los Angeles, CA',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q6',
            text: 'Memphis, TN is a critical freight hub largely because of which company headquartered there?',
            options: ['Amazon — its largest fulfillment center', 'FedEx — its global air and ground hub', 'UPS — its primary distribution center', 'USPS — its central sorting facility'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q7',
            text: 'Which Interstate highway forms the primary east-west southern corridor, connecting Los Angeles to Jacksonville, FL via Houston?',
            options: ['I-40', 'I-80', 'I-10', 'I-70'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q8',
            text: 'When does the main US freight peak season occur, and what drives it?',
            options: [
              'January–March — post-holiday returns and restocking',
              'October–December — holiday retail shipping surges drive demand across all freight types',
              'June–August — summer construction and outdoor retail season',
              'March–May — produce season is the dominant driver',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q9',
            text: 'California outbound freight (loads leaving CA going east) is generally described as:',
            options: [
              'Soft — California trucks rarely go east',
              'Strong — California generates enormous freight volume and east-bound loads are plentiful',
              'Average — same as most other states',
              'Only profitable in summer during produce season',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q10',
            text: 'What are CARB regulations and how do they affect freight dispatching in California?',
            options: [
              'Cargo weight limits that restrict how much a truck can carry in California',
              'Emissions standards enforced by California — trucks must meet specific requirements to operate in-state, limiting which carriers can serve CA lanes',
              'Speed limits on California interstates that slow delivery times',
              'Union labor rules that require California-licensed drivers for all in-state pickups',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q11',
            text: 'Mini-case: Your driver just delivered in Miami, FL (ET). It\'s November. You see two loads:\nLoad A: Miami → Chicago, IL | $2,800 | 1,380 miles | $2.03/mi\nLoad B: Miami → Rural Montana | $3,100 | 2,100 miles | $1.48/mi\nWhich do you choose and why?',
            options: [
              'Load B — higher total payout always wins',
              'Load A — Chicago is a major freight hub with strong outbound options; Montana is a near-freight desert, making the next load extremely difficult to find despite higher gross',
              'Load B — longer haul means more driving time for the driver',
              'Load A only because of higher RPM — geography is secondary',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q12',
            text: 'Mini-case: It\'s January. You need to route a driver from Denver, CO to Columbus, OH — approximately 1,200 miles. A colleague suggests I-70 East straight through. What should you consider before approving that route?',
            options: [
              'Nothing — I-70 East from Denver is always the fastest and safest route',
              'I-70 west of Denver has dangerous mountain passes; however east of Denver toward Kansas it is flat. The segment through the Rockies is the concern — check weather conditions and consider if the driver is heading EAST from Denver (the mountain section is actually west of Denver, so eastbound from Denver is fine)',
              'Route through I-80 north instead — it is always safer than I-70',
              'Denver to Columbus via I-70 East is entirely through flat terrain — no concerns',
            ],
            correctIndex: 3,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-th-q1',
            text: 'Какой город считается самым важным грузовым хабом США благодаря центральному расположению и дорожной сети?',
            options: ['Даллас, TX', 'Чикаго, IL', 'Лос-Анджелес, CA', 'Атланта, GA'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q2',
            text: 'Что такое "горячий рынок" (hot market) в грузовом диспетчинге?',
            options: [
              'Регион с очень высокими температурами, требующий рефрижераторных прицепов',
              'Рынок, где спрос на грузы превышает количество доступных грузовиков, что ведёт к росту ставок',
              'Брокер, стабильно платящий выше рыночных ставок',
              'Маршрут, прибыльный только летом',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q3',
            text: 'Какое межштатное шоссе проходит с севера на юг вдоль Западного побережья, соединяя Сиэтл с Лос-Анджелесом?',
            options: ['I-80', 'I-40', 'I-5', 'I-10'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q4',
            text: 'Какова главная практическая опасность маршрута по I-70 к западу от Денвера, CO в декабре?',
            options: [
              'Плотный трафик грузовиков и строительные задержки',
              'I-70 к западу от Денвера проходит через опасные горные перевалы, которые в зимних условиях становятся крайне опасными',
              'На этом участке I-70 нет грузовых стоянок',
              'На этом участке применяются калифорнийские нормы CARB',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q5',
            text: 'Какой регион США считается почти "грузовой пустыней" — крайне сложным для поиска исходящих грузов?',
            options: [
              'Чикаго, IL и коридор Среднего Запада',
              'Даллас/Форт-Уэрт, TX',
              'Сельская Монтана или Вайоминг',
              'Лос-Анджелес, CA',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q6',
            text: 'Мемфис, TN является крупным грузовым хабом во многом благодаря какой компании, базирующейся там?',
            options: ['Amazon — крупнейший центр выполнения заказов', 'FedEx — глобальный воздушный и наземный хаб', 'UPS — главный дистрибьюторский центр', 'USPS — центральный сортировочный комплекс'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q7',
            text: 'Какое шоссе образует основной восточно-западный южный коридор, соединяя Лос-Анджелес с Джэксонвиллем через Хьюстон?',
            options: ['I-40', 'I-80', 'I-10', 'I-70'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q8',
            text: 'Когда происходит основной пиковый сезон грузоперевозок США и что его вызывает?',
            options: [
              'Январь–март — послепраздничные возвраты и пополнение складов',
              'Октябрь–декабрь — предпраздничные розничные отгрузки резко повышают спрос по всем типам грузов',
              'Июнь–август — летний строительный и розничный сезон',
              'Март–май — сезон продуктов питания является главным драйвером',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q9',
            text: 'Как характеризуется исходящий поток грузов из Калифорнии (CA → восток)?',
            options: [
              'Слабый — калифорнийские грузовики редко едут на восток',
              'Сильный — Калифорния генерирует огромные объёмы грузов, исходящие на восток грузы многочисленны',
              'Средний — как и в большинстве других штатов',
              'Прибыльный только летом в сезон продуктов питания',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q10',
            text: 'Что такое нормы CARB и как они влияют на грузовой диспетчинг в Калифорнии?',
            options: [
              'Ограничения веса груза, регулирующие нагрузку на грузовик в Калифорнии',
              'Стандарты выбросов CARB — грузовики должны им соответствовать для работы в штате, что ограничивает список перевозчиков, способных обслуживать калифорнийские маршруты',
              'Ограничения скорости на калифорнийских шоссе, замедляющие доставку',
              'Правила профсоюзного труда, обязывающие использовать водителей с калифорнийскими лицензиями',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q11',
            text: 'Мини-кейс: Ваш водитель доставил груз в Майами, FL (ET). Ноябрь. Два варианта:\nГруз A: Miami → Chicago, IL | $2 800 | 1 380 миль | $2.03/миль\nГруз B: Miami → Сельская Монтана | $3 100 | 2 100 миль | $1.48/миль\nКакой выбрать и почему?',
            options: [
              'Груз B — более высокая общая выплата всегда важнее',
              'Груз A — Чикаго крупный хаб с хорошим рынком исходящих грузов; Монтана — почти грузовая пустыня, следующий груз найти крайне сложно, несмотря на более высокий gross',
              'Груз B — более длинный рейс означает больше времени за рулём для водителя',
              'Груз A только из-за более высокого RPM — география второстепенна',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q12',
            text: 'Мини-кейс: Январь. Нужно провести водителя из Денвера, CO в Колумбус, OH (~1 200 миль). Коллега предлагает ехать прямо по I-70 на восток. Что важно учесть?',
            options: [
              'Ничего — I-70 на восток от Денвера всегда самый быстрый и безопасный маршрут',
              'I-70 к западу от Денвера проходит через опасные горные перевалы; однако от Денвера на восток (через Канзас) рельеф ровный. Опасный горный участок — к западу от Денвера, а не к востоку',
              'Лучше ехать по I-80 на север — он всегда безопаснее I-70',
              'Маршрут Denver → Columbus по I-70 East полностью пролегает по равнине — никаких опасений',
            ],
            correctIndex: 3,
          },
        ],
      },
    },
    '2-3': {
      type: 'text',
      body: `
        <h2>Demo: Managing a Cross-Country Load Across Time Zones</h2>
        <p>This demo follows dispatcher Maria, working from Dallas, TX (Central Time), as she manages a cross-country run from Los Angeles, CA to Chicago, IL — a load that crosses three time zones and covers 2,015 miles.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="US Time Zone Map" loading="lazy" />
          <figcaption>Keep this map in mind throughout the demo — every timestamp Maria tracks is tied to a specific time zone on this map</figcaption>
        </figure>

        <h3>7:30 AM CT — Morning Setup</h3>
        <p>Maria starts her day by checking her driver's status. Her driver, Carlos, just delivered in Los Angeles, CA. It's 7:30 AM in Dallas (CT) — but in LA it's only 5:30 AM Pacific Time. Carlos is still resting. Maria notes this immediately: any pickup appointment she schedules can't be before 8:00 AM PT (10:00 AM CT) at the absolute earliest to give Carlos enough rest time and HOS reset.</p>
        <blockquote><strong>Time zone rule in action:</strong> Maria always thinks in the local time of wherever Carlos physically is — right now that's Pacific Time.</blockquote>

        <h3>8:00 AM CT (6:00 AM PT) — Load Board Search</h3>
        <p>Maria opens the load board and searches for loads from Los Angeles eastbound. She sees several options and calculates RPM for each:</p>
        <blockquote>
          Load A: LA → Chicago, IL | $3,200 | 2,015 miles | RPM: <strong>$1.59/mi</strong><br/>
          Load B: LA → Dallas, TX | $2,100 | 1,440 miles | RPM: <strong>$1.46/mi</strong><br/>
          Load C: LA → Denver, CO | $1,800 | 1,020 miles | RPM: <strong>$1.76/mi</strong><br/>
          Load D: LA → Atlanta, GA | $3,600 | 2,175 miles | RPM: <strong>$1.66/mi</strong>
        </blockquote>
        <p>Maria considers Load D (Atlanta) and Load A (Chicago). Both are strong freight markets. Chicago at $3,200 keeps Carlos closer to the Midwest hub where Maria already has broker relationships. Atlanta at $3,600 pays more but Carlos would end up in the Southeast — which is fine, but Maria prefers the Midwest lane. She calls the Chicago broker.</p>

        <h3>8:45 AM CT (6:45 AM PT) — Broker Negotiation</h3>
        <p>Broker: "Rate is $3,200, pickup tomorrow 9:00 AM, delivery Friday 7:00 AM."</p>
        <p>Maria immediately thinks through the time zones:</p>
        <ul>
          <li>Pickup is in Los Angeles — <strong>9:00 AM PT</strong></li>
          <li>Delivery is in Chicago — <strong>7:00 AM CT</strong></li>
          <li>The trip is 2,015 miles — at roughly 600 miles/day, that's about 3.4 driving days</li>
          <li>Pickup Wednesday 9:00 AM PT + 3.4 days = Saturday — the broker wants delivery Friday 7:00 AM CT</li>
        </ul>
        <p>Maria counters: "The timeline is very tight. I need $3,400 to make this work, and the delivery needs to be Friday by noon CT, not 7:00 AM." The broker agrees to $3,350 and 10:00 AM Friday delivery. Maria confirms and waits for the Rate Confirmation.</p>
        <blockquote><strong>Key lesson:</strong> Before agreeing to any rate, always verify that the timeline is achievable. A load that pays well but is impossible to deliver on time is a liability, not an opportunity.</blockquote>

        <h3>9:30 AM CT (7:30 AM PT) — Rate Confirmation Received, Driver Briefing</h3>
        <p>Maria calls Carlos at 7:30 AM PT — now a reasonable time to wake him up. She gives him the full details:</p>
        <ul>
          <li>Pickup: Wednesday 9:00 AM PT at 4521 Commerce Ave, Vernon, CA (near LA)</li>
          <li>Delivery: Friday 10:00 AM CT at 800 W Fulton St, Chicago, IL</li>
          <li>Distance: ~2,015 miles</li>
          <li>Route: I-10 East → I-40 East → I-44 → I-55 North to Chicago</li>
          <li>Note: Avoid I-70 through the Rockies — it's November and mountain passes can be icy</li>
        </ul>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="US Interstate Highway System route map" loading="lazy" />
          <figcaption>The route: I-10 East out of LA → I-40 through Albuquerque → I-44 → I-55 North to Chicago — plan the corridor before committing to the timeline</figcaption>
        </figure>

        <p>Maria specifically tells Carlos: "I-40 through Albuquerque and Amarillo — that's your route. Don't go I-70 through Denver, the mountain passes are risky this time of year."</p>

        <h3>Wednesday 9:00 AM PT — Pickup Confirmed</h3>
        <p>Carlos texts: "Loaded and ready. Departing Vernon, CA. Everything looks good."</p>
        <p>Maria notes the exact departure time in PT and converts: 9:00 AM PT = 11:00 AM CT. She updates her tracking sheet.</p>

        <h3>Wednesday 4:00 PM PT (6:00 PM CT) — Check Call #1</h3>
        <p>Maria calls Carlos for the first check call, approximately 7 hours after departure.</p>
        <p>Carlos: "Just passed Tucson, AZ. About 490 miles covered. I'm in Mountain Time now — it's 5:00 PM here."</p>
        <p>Maria: "Good progress. ETA for tonight's stop?"</p>
        <p>Carlos: "Pulling into a truck stop near El Paso, TX around 9:00 PM MT (10:00 PM CT). I'll restart and drive 8 hours tomorrow."</p>
        <p>Maria does the math: Wednesday overnight in El Paso (~800 miles from LA). Thursday: ~700 miles to get near Memphis, TN. Friday morning: remaining ~500 miles to Chicago. Friday 10:00 AM CT delivery is achievable.</p>

        <h3>Thursday 2:00 PM CT — Check Call #2 + Time Zone Shift</h3>
        <p>Carlos: "Just crossed into Texas. About 400 miles to go for today — I'm near Amarillo. I'm back on Central Time now."</p>
        <p>This is where many dispatchers get confused: Carlos was on Mountain Time in New Mexico, then crossed back into Central Time as he entered Texas (most of Texas is CT). Maria updates her ETA calculations accordingly.</p>
        <p>Maria: "Check in when you stop tonight. You need to be past Oklahoma City to make the Friday delivery comfortably."</p>

        <h3>Thursday 9:00 PM CT — Evening Update</h3>
        <p>Carlos: "Stopped for the night near Joplin, MO. About 300 miles from Chicago."</p>
        <p>Maria: "Perfect. You need to depart by 4:00 AM CT Friday to hit the 10:00 AM appointment with buffer. Set your alarm."</p>
        <p>300 miles at 60 mph = 5 hours driving. Departing 4:00 AM CT → arriving 9:00 AM CT in the Chicago area. One hour buffer before the 10:00 AM appointment.</p>

        <h3>Friday 9:15 AM CT — Delivery Coordination</h3>
        <p>Carlos calls: "I'm 20 minutes out from the Chicago warehouse."</p>
        <p>Maria calls the broker: "Driver Carlos is 20 minutes from 800 W Fulton St. ETA 9:35 AM CT. He'll make the 10:00 AM appointment."</p>
        <p>Broker: "Great, they're ready for him."</p>

        <h3>Friday 11:30 AM CT — Delivery Complete</h3>
        <p>Carlos: "Unloaded and signed. Clean delivery. POD in hand."</p>
        <p>Maria immediately opens the load board for Chicago outbound loads. Chicago is one of the strongest outbound markets in the country — she finds a $2,800 load to Atlanta within 20 minutes.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="18-wheeler completing cross-country run" loading="lazy" />
          <figcaption>The cross-country run complete — 2,015 miles, three time zones, two and a half days. The dispatcher's coordination made every mile count</figcaption>
        </figure>

        <h3>Full Run Summary</h3>
        <blockquote>
          Route: Los Angeles, CA → Chicago, IL<br/>
          Distance: 2,015 miles<br/>
          Rate: $3,350<br/>
          RPM: $1.66/mile<br/>
          Transit time: 2.5 days (Wednesday morning → Friday morning)<br/>
          Time zones crossed: PT → MT → CT<br/>
          Dispatcher commission (10%): $335<br/>
          Key decisions: I-40 route selection (avoided I-70 mountain risk), timeline verification before booking, proactive ETA management
        </blockquote>
      `,
      bodyRu: `
        <h2>Демо: Управление трансконтинентальным рейсом через часовые пояса</h2>
        <p>В этом демо мы следим за диспетчером Марией, работающей из Далласа, TX (Central Time), которая управляет рейсом из Лос-Анджелеса, CA в Чикаго, IL — груз пересекает три часовых пояса и преодолевает 2 015 миль.</p>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/US-Timezones.svg/960px-US-Timezones.svg.png" alt="Карта часовых поясов США" loading="lazy" />
          <figcaption>Держите эту карту в уме на протяжении всего демо — каждая временная метка Марии привязана к конкретному часовому поясу</figcaption>
        </figure>

        <h3>7:30 CT — Утренняя подготовка</h3>
        <p>Мария начинает день с проверки статуса водителя. Её водитель Карлос только что доставил груз в Лос-Анджелесе. В Далласе 7:30 CT, но в LA всего 5:30 PT. Карлос ещё отдыхает. Мария сразу это фиксирует: любой appointment на загрузку не может быть раньше 8:00 PT (10:00 CT) — водителю нужно время на отдых и сброс HOS.</p>
        <blockquote><strong>Правило часового пояса в действии:</strong> Мария всегда думает в местном времени того места, где физически находится Карлос — сейчас это Pacific Time.</blockquote>

        <h3>8:00 CT (6:00 PT) — Поиск груза на Load Board</h3>
        <p>Мария открывает load board и ищет грузы из Лос-Анджелеса на восток. Рассчитывает RPM для каждого варианта:</p>
        <blockquote>
          Груз A: LA → Chicago, IL | $3 200 | 2 015 миль | RPM: <strong>$1.59/миль</strong><br/>
          Груз B: LA → Dallas, TX | $2 100 | 1 440 миль | RPM: <strong>$1.46/миль</strong><br/>
          Груз C: LA → Denver, CO | $1 800 | 1 020 миль | RPM: <strong>$1.76/миль</strong><br/>
          Груз D: LA → Atlanta, GA | $3 600 | 2 175 миль | RPM: <strong>$1.66/миль</strong>
        </blockquote>
        <p>Мария рассматривает Груз D (Атланта) и Груз A (Чикаго). Оба — сильные рынки. Чикаго за $3 200 оставляет Карлоса ближе к хабу Среднего Запада, где у Марии есть устоявшиеся отношения с брокерами. Она звонит чикагскому брокеру.</p>

        <h3>8:45 CT (6:45 PT) — Переговоры с брокером</h3>
        <p>Брокер: "Ставка $3 200, загрузка завтра в 9:00, доставка в пятницу в 7:00 утра."</p>
        <p>Мария сразу прорабатывает часовые пояса:</p>
        <ul>
          <li>Загрузка в Лос-Анджелесе — <strong>9:00 PT</strong></li>
          <li>Доставка в Чикаго — <strong>7:00 CT</strong></li>
          <li>Рейс 2 015 миль — при ~600 миль/день около 3.4 дней вождения</li>
          <li>Загрузка среда 9:00 PT + 3.4 дня = суббота — брокер хочет доставку в пятницу 7:00 CT</li>
        </ul>
        <p>Мария делает встречное предложение: "График очень жёсткий. Нам нужно $3 400, и доставка должна быть в пятницу к полудню CT, а не к 7:00 утра." Брокер соглашается на $3 350 и доставку до 10:00 CT в пятницу.</p>
        <blockquote><strong>Ключевой урок:</strong> Прежде чем соглашаться на ставку, всегда проверяйте, реален ли срок. Груз с хорошей оплатой, который невозможно доставить вовремя — это риск, а не возможность.</blockquote>

        <h3>9:30 CT (7:30 PT) — Rate Confirmation получен, инструктаж водителя</h3>
        <p>Мария звонит Карлосу в 7:30 PT — уже приемлемое время. Передаёт полные детали:</p>
        <ul>
          <li>Загрузка: среда 9:00 PT, 4521 Commerce Ave, Vernon, CA (рядом с LA)</li>
          <li>Доставка: пятница 10:00 CT, 800 W Fulton St, Chicago, IL</li>
          <li>Расстояние: ~2 015 миль</li>
          <li>Маршрут: I-10 East → I-40 East → I-44 → I-55 North до Чикаго</li>
          <li>Важно: избегать I-70 через Скалистые горы — ноябрь, горные перевалы могут быть обледеневшими</li>
        </ul>

        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Map_of_current_Interstates.svg/1280px-Map_of_current_Interstates.svg.png" alt="Маршрут по системе межштатных шоссе США" loading="lazy" />
          <figcaption>Маршрут: I-10 East из LA → I-40 через Альбукерке → I-44 → I-55 North до Чикаго — проложите коридор до того, как брать обязательства по срокам</figcaption>
        </figure>

        <h3>Среда 9:00 PT — Загрузка подтверждена</h3>
        <p>Карлос пишет: "Загрузился, выезжаю из Vernon, CA. Всё отлично."</p>
        <p>Мария фиксирует время выезда в PT и конвертирует: 9:00 PT = 11:00 CT. Обновляет таблицу отслеживания.</p>

        <h3>Среда 16:00 PT (18:00 CT) — Check Call #1</h3>
        <p>Мария звонит Карлосу примерно через 7 часов после отправки.</p>
        <p>Карлос: "Только проехал Тусон, AZ. Пройдено около 490 миль. Я уже в Mountain Time — здесь 17:00."</p>
        <p>Мария делает расчёт: среда ночёвка у Эль-Пасо (~800 миль от LA). Четверг: ~700 миль до района Мемфиса. Пятница утром: оставшиеся ~500 миль до Чикаго. Доставка пятница 10:00 CT — достижимо.</p>

        <h3>Четверг 14:00 CT — Check Call #2 + смена часового пояса</h3>
        <p>Карлос: "Только въехал в Техас. Около 400 миль на сегодня — я у Амарилло. Я снова на Central Time."</p>
        <p>Именно здесь многие диспетчеры путаются: Карлос был на Mountain Time в Нью-Мексико, затем вернулся на Central Time, въехав в Техас. Мария обновляет расчёты ETA.</p>

        <h3>Четверг 21:00 CT — Вечернее обновление</h3>
        <p>Карлос: "Остановился на ночь у Джоплина, MO. До Чикаго около 300 миль."</p>
        <p>Мария: "Отлично. Выезжай в 4:00 CT пятница, чтобы к 10:00 быть с запасом."</p>
        <p>300 миль при 60 км/ч = 5 часов. Выезд 4:00 CT → прибытие ~9:00 CT. Час буфера до appointment в 10:00.</p>

        <h3>Пятница 11:30 CT — Доставка завершена</h3>
        <p>Карлос: "Разгрузился, всё подписано. POD на руках."</p>
        <p>Мария немедленно открывает load board для исходящих грузов из Чикаго. Чикаго — один из сильнейших исходящих рынков: за 20 минут находит груз $2 800 в Атланту.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?w=800" alt="18-wheeler завершает трансконтинентальный рейс" loading="lazy" />
          <figcaption>Трансконтинентальный рейс завершён — 2 015 миль, три часовых пояса, 2,5 дня. Координация диспетчера сделала каждую милю рабочей</figcaption>
        </figure>

        <h3>Итоги рейса</h3>
        <blockquote>
          Маршрут: Los Angeles, CA → Chicago, IL<br/>
          Расстояние: 2 015 миль<br/>
          Ставка: $3 350<br/>
          RPM: $1.66/миль<br/>
          Время в пути: 2.5 дня (среда утро → пятница утро)<br/>
          Пересечённые часовые пояса: PT → MT → CT<br/>
          Комиссия диспетчера (10%): $335<br/>
          Ключевые решения: выбор маршрута I-40 (избежали риска I-70), проверка сроков перед бронированием, проактивное управление ETA
        </blockquote>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-dm-q1',
            text: 'In the Demo, Maria works from Dallas, TX (CT) while her driver Carlos is in Los Angeles (PT). At 7:30 AM CT, what time is it for Carlos in LA?',
            options: ['4:30 AM PT', '5:30 AM PT', '6:30 AM PT', '8:30 AM PT'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q2',
            text: 'Why did Maria choose the I-40 route through Albuquerque and Amarillo rather than I-70 through Denver for the November run?',
            options: [
              'I-70 has more truck stops than I-40',
              'I-70 west of Denver goes through mountain passes that are dangerous in November winter conditions',
              'I-40 is shorter than I-70 for this route',
              'I-70 has higher tolls than I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q3',
            text: 'The broker offered delivery at "7:00 AM CT Friday." Maria countered to change it to 10:00 AM CT. Why?',
            options: [
              'Carlos prefers late morning deliveries',
              'The original 7:00 AM Friday timeline was too tight given the 2,015-mile distance and pickup on Wednesday — a later window gives necessary buffer',
              'The warehouse in Chicago doesn\'t open until 10:00 AM',
              'Maria wanted to charge a higher rate for early delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q4',
            text: 'Carlos crosses from New Mexico into Texas. What time zone change occurs?',
            options: [
              'Pacific Time → Mountain Time',
              'Mountain Time → Central Time',
              'Central Time → Eastern Time',
              'No change — Texas and New Mexico are in the same time zone',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q5',
            text: 'Carlos reports he\'s 300 miles from Chicago at 9:00 PM CT Thursday. Maria tells him to depart at 4:00 AM CT Friday. What is the reasoning?',
            options: [
              '300 miles at 60 mph = 5 hours; departing 4:00 AM gets him there by 9:00 AM, giving a 1-hour buffer before the 10:00 AM appointment',
              'The driver needs exactly 7 hours to cover 300 miles',
              'Chicago traffic is lightest at 9:00 AM, so early departure is needed',
              'FMCSA requires drivers to arrive at least 2 hours before all delivery appointments',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q6',
            text: 'Why did Maria immediately search for the next Chicago outbound load as soon as Carlos confirmed delivery?',
            options: [
              'She was required to by her dispatcher contract',
              'Chicago is one of the strongest outbound freight markets — acting immediately avoids driver downtime and keeps revenue flowing',
              'The broker demanded she find a return load as part of the original deal',
              'Carlos had already driven too many miles and needed a short local load',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q7',
            text: 'The pickup appointment is at 9:00 AM PT. What is the equivalent time in Maria\'s Dallas (CT) office?',
            options: ['8:00 AM CT', '9:00 AM CT', '10:00 AM CT', '11:00 AM CT'],
            correctIndex: 3,
          },
          {
            id: 'geo-dm-q8',
            text: 'Maria\'s final rate was $3,350 for 2,015 miles. What is the RPM?',
            options: ['$1.46/mile', '$1.59/mile', '$1.66/mile', '$1.76/mile'],
            correctIndex: 2,
          },
          {
            id: 'geo-dm-q9',
            text: 'What is the professional term for the call Maria makes to Carlos to verify his location and status during transit?',
            options: ['Status update', 'Check call', 'ETA confirmation', 'Route verification'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q10',
            text: 'When Maria verified the timeline before accepting the load, she found the original 7:00 AM Friday delivery was too tight. This is an example of:',
            options: [
              'Over-negotiating a rate',
              'Checking ETA feasibility before booking — a critical dispatcher skill that prevents late deliveries and damaged broker relationships',
              'Refusing a load without good reason',
              'Standard industry practice of always asking for later delivery times',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q11',
            text: 'Mini-case: You\'re dispatching from New York (ET). Your driver picks up in Seattle, WA (PT) Thursday at 8:00 AM PT. Delivery in Atlanta, GA (ET) is Monday at 9:00 AM ET. Distance: 2,850 miles. Driver averages 600 miles/day. Is the schedule feasible?',
            options: [
              'No — 2,850 miles ÷ 600 miles/day = 4.75 days. Thursday 8 AM PT + 4.75 days = Monday ~11 AM PT = Monday ~2 PM ET — the driver misses the 9:00 AM ET Monday appointment',
              'Yes — easily achievable, the driver has plenty of time',
              'Yes — because crossing time zones from PT to ET adds 3 hours, making the effective driving time shorter',
              'No — FMCSA does not allow drivers to cross more than 2 time zones in one trip',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q12',
            text: 'Mini-case: After delivering in Chicago, Maria finds a $2,800 Atlanta load in 20 minutes. A colleague says "You got lucky — Chicago loads are hard to find." Is this correct?',
            options: [
              'Yes — finding any load in under an hour is rare luck',
              'No — Chicago is one of the top freight hubs in the US with constant outbound load availability; finding a load quickly there is expected, not lucky',
              'Partially — Chicago is only a strong market during peak season',
              'Yes — Atlanta loads from Chicago are specifically rare because the lane is always oversaturated',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-dm-q1',
            text: 'В демо Мария работает из Далласа, TX (CT), а водитель Карлос — в Лос-Анджелесе (PT). В 7:30 CT у Марии, который час у Карлоса в LA?',
            options: ['4:30 PT', '5:30 PT', '6:30 PT', '8:30 PT'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q2',
            text: 'Почему Мария выбрала маршрут по I-40 через Альбукерке и Амарилло, а не по I-70 через Денвер для ноябрьского рейса?',
            options: [
              'На I-70 больше грузовых стоянок, чем на I-40',
              'I-70 к западу от Денвера проходит через горные перевалы, опасные в ноябрьских зимних условиях',
              'I-40 короче I-70 для этого маршрута',
              'На I-70 более высокие платные сборы',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q3',
            text: 'Брокер предложил доставку в "7:00 CT пятница". Мария попросила перенести на 10:00 CT. Почему?',
            options: [
              'Карлос предпочитает доставки в середине утра',
              'Исходный срок 7:00 CT пятница был слишком жёстким при расстоянии 2 015 миль и загрузке в среду — более позднее окно даёт необходимый запас времени',
              'Склад в Чикаго открывается только в 10:00',
              'Мария хотела взять более высокую ставку за раннюю доставку',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q4',
            text: 'Карлос пересекает границу Нью-Мексико и Техаса. Какая смена часового пояса происходит?',
            options: [
              'Pacific Time → Mountain Time',
              'Mountain Time → Central Time',
              'Central Time → Eastern Time',
              'Никакой — Техас и Нью-Мексико в одном часовом поясе',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q5',
            text: 'Карлос сообщает, что в четверг в 21:00 CT он в 300 милях от Чикаго. Мария говорит выехать в 4:00 CT пятницы. В чём логика?',
            options: [
              '300 миль при 60 миль/час = 5 часов; выезд в 4:00 — прибытие к 9:00, буфер 1 час до appointment в 10:00',
              'Водителю нужно ровно 7 часов на 300 миль',
              'Чикагские пробки минимальны в 9:00 утра, поэтому нужен ранний выезд',
              'FMCSA требует прибывать за 2 часа до всех delivery appointments',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q6',
            text: 'Почему Мария немедленно начала искать следующий груз из Чикаго сразу после подтверждения доставки?',
            options: [
              'Это требовалось по её диспетчерскому контракту',
              'Чикаго — один из сильнейших исходящих рынков грузов; действие немедленно позволяет избежать простоя водителя и поддерживать доход',
              'Брокер потребовал найти обратный груз как часть исходного договора',
              'Карлос проехал слишком много миль и нуждался в коротком местном грузе',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q7',
            text: 'Appointment на загрузку — 9:00 PT. Какое это время в офисе Марии в Далласе (CT)?',
            options: ['8:00 CT', '9:00 CT', '10:00 CT', '11:00 CT'],
            correctIndex: 3,
          },
          {
            id: 'geo-dm-q8',
            text: 'Итоговая ставка Марии — $3 350 за 2 015 миль. Каков RPM?',
            options: ['$1.46/миль', '$1.59/миль', '$1.66/миль', '$1.76/миль'],
            correctIndex: 2,
          },
          {
            id: 'geo-dm-q9',
            text: 'Как профессионально называется звонок, который Мария делает Карлосу во время рейса для проверки местоположения и статуса?',
            options: ['Обновление статуса', 'Check call', 'Подтверждение ETA', 'Проверка маршрута'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q10',
            text: 'Когда Мария проверила сроки и обнаружила, что доставка в 7:00 CT пятницы нереальна, это пример:',
            options: [
              'Чрезмерного торга по ставке',
              'Проверки выполнимости ETA перед бронированием — критически важный навык диспетчера, предотвращающий опоздания и ущерб репутации',
              'Отказа от груза без веских оснований',
              'Стандартной практики всегда просить более позднее время доставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q11',
            text: 'Мини-кейс: Вы диспетчер в Нью-Йорке (ET). Водитель забирает груз в Сиэтле (PT) в четверг в 8:00 PT. Доставка в Атланте (ET) в понедельник в 9:00 ET. Расстояние: 2 850 миль. Водитель в среднем 600 миль/день. Реален ли график?',
            options: [
              'Нет — 2 850 ÷ 600 = 4.75 дня. Четверг 8:00 PT + 4.75 дня = понедельник ~11:00 PT = ~14:00 ET — водитель не успевает к 9:00 ET понедельника',
              'Да — времени вполне достаточно',
              'Да — пересечение часовых поясов с PT на ET прибавляет 3 часа, сокращая эффективное время вождения',
              'Нет — FMCSA не разрешает водителям пересекать более 2 часовых поясов в одном рейсе',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q12',
            text: 'Мини-кейс: После доставки в Чикаго Мария нашла груз в Атланту за 20 минут. Коллега говорит: "Тебе повезло — грузы из Чикаго трудно найти." Верно ли это?',
            options: [
              'Да — найти груз менее чем за час — редкая удача',
              'Нет — Чикаго один из ведущих грузовых хабов США с постоянным наличием исходящих грузов; быстрый поиск там закономерен, а не случаен',
              'Частично — Чикаго сильный рынок только в пиковый сезон',
              'Да — грузы Atlanta из Чикаго редки из-за перенасыщения маршрута',
            ],
            correctIndex: 1,
          },
        ],
      },
      freightMap: true,
    },
    '2-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 2: Geography & Time Zones</h2>
        <p>This practice test covers all material from Chapter 2: US time zones, regional freight profiles, major highway corridors, key freight hubs, lane dynamics, and seasonal patterns.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Four US time zones (PT, MT, CT, ET) and DST rules including the Arizona exception</li>
          <li>Time zone conversions and communication standards</li>
          <li>US regional freight profiles: West Coast, Mountain West, Southwest, Midwest, Southeast, Northeast</li>
          <li>Major interstates: I-5, I-10, I-40, I-70, I-80, I-90, I-95, I-35</li>
          <li>Freight hubs, lane balance, hot vs soft markets, seasonal patterns</li>
          <li>California CARB regulations</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 2: География и часовые пояса</h2>
        <p>Этот практический тест охватывает все материалы Главы 2: часовые пояса США, региональные профили грузов, основные автомобильные коридоры, ключевые хабы, динамику маршрутов и сезонные закономерности.</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных и 5 мини-кейсов.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20) для прохождения практики по этой главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Четыре часовых пояса США (PT, MT, CT, ET) и правила DST, включая исключение Аризоны</li>
          <li>Конвертация часовых поясов и стандарты коммуникации</li>
          <li>Региональные профили грузов: Западное побережье, Mountain West, Юго-Запад, Средний Запад, Юго-Восток, Северо-Восток</li>
          <li>Основные шоссе: I-5, I-10, I-40, I-70, I-80, I-90, I-95, I-35</li>
          <li>Грузовые хабы, баланс маршрутов, горячие и мягкие рынки, сезонные закономерности</li>
          <li>Нормы CARB Калифорнии</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-pr-q1',
            text: 'It is 2:00 PM Pacific Time on a Tuesday. What time is it in New York (Eastern Time)?',
            options: ['1:00 PM ET', '3:00 PM ET', '4:00 PM ET', '5:00 PM ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q2',
            text: 'Which state observes Mountain Standard Time (UTC-7) year-round without adjusting for Daylight Saving Time?',
            options: ['Colorado', 'Utah', 'Arizona', 'Nevada'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q3',
            text: 'A shipper in Houston, TX (CT) schedules a pickup for "6:00 AM CT." Your driver is coming from Phoenix, AZ (MT, no DST). In January, what time should the driver depart Phoenix to arrive by 6:00 AM CT in Houston, assuming the drive takes exactly 14 hours?',
            options: [
              'Depart 4:00 PM MT the previous day (14 hrs before 6:00 AM MT = 4:00 PM; 6:00 AM CT = 5:00 AM MT in January)',
              'Depart 3:00 PM MT the previous day (6:00 AM CT = 5:00 AM MT in January; 5:00 AM − 14 hrs = 3:00 PM MT)',
              'Depart 4:00 PM MT the previous day',
              'Depart 5:00 PM MT the previous day',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q4',
            text: 'Which Interstate highway runs north-south through the center of the US, connecting San Antonio, TX to Minneapolis, MN?',
            options: ['I-70', 'I-35', 'I-80', 'I-40'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q5',
            text: 'Which city is universally recognized as the freight capital of the United States?',
            options: ['Los Angeles, CA', 'Dallas, TX', 'Chicago, IL', 'Atlanta, GA'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q6',
            text: 'A dispatcher books a load: pickup in Seattle, WA (PT) at 8:00 AM, delivery in Boston, MA (ET). In the driver\'s trip sheet, what time should the pickup be listed as?',
            options: [
              '8:00 AM ET — always use ET as the standard',
              '8:00 AM PT — use the local time of the pickup location',
              '11:00 AM ET — convert to Eastern Time',
              '5:00 AM PT — convert to the driver\'s home time',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q7',
            text: 'What is the primary east-west southern highway corridor connecting Los Angeles to Jacksonville, FL?',
            options: ['I-40', 'I-80', 'I-70', 'I-10'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q8',
            text: 'Your driver delivers in rural Wyoming in February. What is the first thing you should do?',
            options: [
              'Call the consignee to confirm delivery quality',
              'Immediately search for the next load — Wyoming is a near-freight desert and every hour without a load is lost revenue',
              'Schedule mandatory 10-hour rest for the driver before searching',
              'Post the truck on the load board and wait for brokers to call',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q9',
            text: 'California\'s CARB emission standards affect freight dispatching primarily by:',
            options: [
              'Requiring all drivers to hold a California CDL endorsement',
              'Limiting which carriers (trucks) can legally operate in California based on emissions compliance',
              'Restricting delivery hours to 8:00 AM – 6:00 PM in California',
              'Adding a mandatory fuel surcharge to all California loads',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q10',
            text: 'Which US freight region typically has strong outbound freight volume but can be challenging for inbound (many trucks compete to get there, pushing inbound rates down)?',
            options: ['The Midwest (Chicago area)', 'The Northeast (New York/NJ)', 'California (Los Angeles)', 'The Southeast (Atlanta)'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q11',
            text: 'What happens to freight rates and load availability during the October–December peak season?',
            options: [
              'Rates drop due to increased competition between carriers',
              'Load volume decreases as companies prepare for year-end accounting',
              'Rates climb and capacity tightens — it is the best time to negotiate higher rates',
              'Only reefer freight increases; dry van volume stays flat',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q12',
            text: 'Which Interstate highway warning should every dispatcher know for winter routing east of the Rockies?',
            options: [
              'I-80 through Wyoming can be extremely dangerous in winter due to high winds and blizzards',
              'I-95 is closed in winter between New York and Boston',
              'I-40 is impassable in winter through New Mexico',
              'I-10 through Texas floods every winter',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-pr-q13',
            text: 'A load from Los Angeles to Atlanta has a rate of $3,800 for 2,175 miles. A load from LA to Denver pays $1,800 for 1,020 miles. Which has a higher RPM?',
            options: [
              'LA → Atlanta: $1.75/mi — higher RPM',
              'LA → Denver: $1.76/mi — higher RPM, but only slightly',
              'LA → Atlanta: $1.66/mi — higher RPM',
              'They are equal',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q14',
            text: 'Memphis, TN is strategically important for freight because:',
            options: [
              'It has the largest population in the South',
              'It is home to FedEx\'s global hub and sits at the geographic center of US freight flow',
              'Memphis has the lowest diesel prices in the country',
              'It is the eastern terminus of I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q15',
            text: 'In January, when Eastern Time is UTC-5 and most of Mountain Time is UTC-7, how many hours behind ET is Arizona (which is always UTC-7)?',
            options: ['1 hour behind ET', '2 hours behind ET', '3 hours behind ET', 'Same time as ET'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q16',
            text: 'Mini-case: It\'s December. Your driver is empty in Billings, MT (MT). You see these loads:\nA: Billings → Chicago, IL | $2,400 | 1,380 miles | $1.74/mi\nB: Billings → Seattle, WA | $1,200 | 680 miles | $1.76/mi\nC: Billings → Dallas, TX | $2,100 | 1,250 miles | $1.68/mi\nWhich do you choose?',
            options: [
              'Load B — highest RPM at $1.76/mi',
              'Load A — Chicago is the top US freight hub; despite similar RPM, the destination gives the best options for the next load and the driver escapes a low-activity region',
              'Load C — Dallas is a strong market and warmer in December',
              'Load B — shorter haul means the driver finishes faster',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q17',
            text: 'Mini-case: A broker in Atlanta (ET) calls you at 9:00 AM ET Monday. The pickup is in Albuquerque, NM (MT) "Tuesday at 7:00 AM." It\'s January. What time do you tell the driver to be at the shipper?',
            options: [
              '7:00 AM ET — always communicate in the broker\'s time zone',
              '7:00 AM MT — the appointment is at the shipper\'s location, which is on Mountain Time',
              '9:00 AM MT — add 2 hours for the ET-to-MT conversion',
              '5:00 AM MT — subtract 2 hours from ET',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q18',
            text: 'Mini-case: You need to route a driver from Los Angeles to Chicago in November. Distance: 2,015 miles. Two route options:\nRoute 1: I-15 North → I-70 East through Denver → I-70 to Chicago\nRoute 2: I-10 East → I-40 East → I-55 North to Chicago\nWhich do you recommend?',
            options: [
              'Route 1 — more direct through Denver',
              'Route 2 — I-40 avoids the dangerous mountain passes on I-70 west of Denver; in November, this is the safer and more reliable choice',
              'Route 1 — I-70 is a faster highway overall',
              'Either route is equally safe in November',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q19',
            text: 'Mini-case: Your driver delivers in Miami, FL (ET) Thursday at 3:00 PM. You find a load: Miami → Los Angeles, CA (PT) — 2,750 miles, $4,100, pickup Friday 8:00 AM ET. The driver has 8 hours of HOS remaining Thursday. Is this load feasible, and is it a good deal?',
            options: [
              'Yes and yes — $4,100 is a huge payout and the schedule works',
              'Feasible on timing (driver rests Thursday night, picks up Friday). But $4,100 ÷ 2,750 = $1.49/mi RPM is below average for a long haul. Additionally, Los Angeles inbound is a soft market with many competing trucks. Consider negotiating a higher rate before accepting.',
              'Not feasible — the driver needs 24 hours of rest before any pickup after a delivery',
              'Good deal but not feasible — the driver cannot make an 8 AM Friday pickup after a Thursday 3 PM delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q20',
            text: 'Mini-case: It\'s August. You dispatch from Chicago (CT). Your driver is in Los Angeles (PT) and has a delivery appointment in New York (ET) that the broker described as "Wednesday 6:00 AM." The driver asks what time that is locally. What do you tell them?',
            options: [
              '"It\'s 3:00 AM PT — the appointment is 3 hours earlier in Pacific Time" — this only matters for the driver\'s departure planning from LA',
              '"The delivery is at 6:00 AM ET Wednesday — when you\'re in New York, you\'ll be in Eastern Time. Plan your drive to arrive by 6:00 AM ET."',
              '"It\'s 6:00 AM CT — use Chicago time since that\'s our base"',
              '"It\'s 9:00 AM PT — add 3 hours for the West Coast"',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-pr-q1',
            text: 'Сейчас 14:00 Pacific Time во вторник. Который час в Нью-Йорке (Eastern Time)?',
            options: ['13:00 ET', '15:00 ET', '16:00 ET', '17:00 ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q2',
            text: 'Какой штат соблюдает Mountain Standard Time (UTC-7) круглый год без перехода на летнее время?',
            options: ['Колорадо', 'Юта', 'Аризона', 'Невада'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q3',
            text: 'Грузоотправитель в Хьюстоне, TX (CT) назначил загрузку на "6:00 CT". Водитель едет из Финикса, AZ (MT, без DST). В январе, в котором часу MT водитель должен выехать, чтобы к 6:00 CT достичь Хьюстона, если поездка занимает ровно 14 часов?',
            options: [
              'Выехать в 16:00 MT накануне (14 часов до 6:00 MT = 16:00; 6:00 CT = 5:00 MT в январе)',
              'Выехать в 15:00 MT накануне (6:00 CT = 5:00 MT в январе; 5:00 − 14 часов = 15:00 MT)',
              'Выехать в 16:00 MT накануне',
              'Выехать в 17:00 MT накануне',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q4',
            text: 'Какое шоссе проходит с севера на юг через центр США, соединяя Сан-Антонио, TX с Миннеаполисом, MN?',
            options: ['I-70', 'I-35', 'I-80', 'I-40'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q5',
            text: 'Какой город повсеместно признан грузовой столицей США?',
            options: ['Лос-Анджелес, CA', 'Даллас, TX', 'Чикаго, IL', 'Атланта, GA'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q6',
            text: 'Диспетчер бронирует груз: загрузка в Сиэтле, WA (PT) в 8:00, доставка в Бостоне, MA (ET). Какое время загрузки указывается в маршрутном листе водителя?',
            options: [
              '8:00 ET — всегда использовать ET как стандарт',
              '8:00 PT — местное время места загрузки',
              '11:00 ET — конвертировать в Eastern Time',
              '5:00 PT — конвертировать в домашнее время водителя',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q7',
            text: 'Какое основное шоссе образует восточно-западный южный коридор, соединяя Лос-Анджелес с Джэксонвиллем, FL?',
            options: ['I-40', 'I-80', 'I-70', 'I-10'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q8',
            text: 'Ваш водитель доставил груз в сельский Вайоминг в феврале. Что сделать первым?',
            options: [
              'Позвонить грузополучателю для подтверждения качества доставки',
              'Немедленно искать следующий груз — Вайоминг почти грузовая пустыня, каждый час без груза — потерянный доход',
              'Поставить водителю обязательный отдых 10 часов перед поиском',
              'Разместить грузовик на load board и ждать звонков от брокеров',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q9',
            text: 'Нормы выбросов CARB в Калифорнии влияют на грузовой диспетчинг прежде всего тем, что:',
            options: [
              'Требуют от всех водителей наличия калифорнийского CDL-эндорсмента',
              'Ограничивают список перевозчиков (грузовиков), которые могут легально работать в Калифорнии, по соответствию нормам выбросов',
              'Запрещают доставки в Калифорнии до 8:00 и после 18:00',
              'Добавляют обязательную топливную надбавку ко всем калифорнийским грузам',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q10',
            text: 'Какой регион США традиционно имеет сильный исходящий поток, но сложный входящий (много грузовиков конкурируют за попадание туда, снижая входящие ставки)?',
            options: ['Средний Запад (район Чикаго)', 'Северо-Восток (Нью-Йорк/NJ)', 'Калифорния (Лос-Анджелес)', 'Юго-Восток (Атланта)'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q11',
            text: 'Что происходит со ставками и доступностью грузов в пиковый сезон октябрь–декабрь?',
            options: [
              'Ставки падают из-за роста конкуренции между перевозчиками',
              'Объём грузов снижается, компании готовятся к закрытию года',
              'Ставки растут, мощности сокращаются — лучшее время для переговоров о высоких ставках',
              'Растёт только рефрижераторный сектор; dry van остаётся неизменным',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q12',
            text: 'Какое предупреждение о зимней маршрутизации должен знать каждый диспетчер применительно к I-80 к востоку от Скалистых гор?',
            options: [
              'I-80 через Вайоминг может быть крайне опасен зимой из-за сильного ветра и метелей',
              'I-95 закрыт зимой между Нью-Йорком и Бостоном',
              'I-40 непроходим зимой через Нью-Мексико',
              'I-10 через Техас ежегодно затапливается зимой',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-pr-q13',
            text: 'Груз из Лос-Анджелеса в Атланту: $3 800 за 2 175 миль. Груз LA → Denver: $1 800 за 1 020 миль. У какого выше RPM?',
            options: [
              'LA → Атланта: $1.75/миль — выше',
              'LA → Денвер: $1.76/миль — выше, но незначительно',
              'LA → Атланта: $1.66/миль — выше',
              'Одинаковые',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q14',
            text: 'Мемфис, TN стратегически важен для грузоперевозок, потому что:',
            options: [
              'Это крупнейший по населению город Юга США',
              'Здесь расположен глобальный хаб FedEx, а сам город находится в географическом центре грузовых потоков США',
              'В Мемфисе самые низкие цены на дизельное топливо в стране',
              'Это восточный конечный пункт I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q15',
            text: 'В январе, когда ET = UTC-5, а большинство Mountain Time = UTC-7, насколько Аризона (всегда UTC-7) отстаёт от ET?',
            options: ['На 1 час', 'На 2 часа', 'На 3 часа', 'Одинаково'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q16',
            text: 'Мини-кейс: Декабрь. Водитель свободен в Биллингсе, MT (MT). Три варианта:\nA: Billings → Chicago, IL | $2 400 | 1 380 миль | $1.74/миль\nB: Billings → Seattle, WA | $1 200 | 680 миль | $1.76/миль\nC: Billings → Dallas, TX | $2 100 | 1 250 миль | $1.68/миль\nКакой выбрать?',
            options: [
              'Груз B — наивысший RPM $1.76/миль',
              'Груз A — Чикаго ведущий грузовой хаб США; несмотря на схожий RPM, пункт назначения даёт лучшие возможности для следующего груза и позволяет водителю покинуть регион с низкой активностью',
              'Груз C — Даллас сильный рынок и теплее в декабре',
              'Груз B — короткий рейс быстрее завершится',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q17',
            text: 'Мини-кейс: Брокер из Атланты (ET) звонит в 9:00 ET в понедельник. Загрузка в Альбукерке, NM (MT) "во вторник в 7:00". Январь. Какое время вы говорите водителю?',
            options: [
              '"7:00 ET" — всегда общаться в часовом поясе брокера',
              '"7:00 MT" — appointment у грузоотправителя, который находится в Mountain Time',
              '"9:00 MT" — прибавить 2 часа для конвертации ET → MT',
              '"5:00 MT" — вычесть 2 часа из ET',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q18',
            text: 'Мини-кейс: Ноябрь. Маршрут из Лос-Анджелеса в Чикаго, 2 015 миль. Два варианта маршрута:\nВариант 1: I-15 North → I-70 East через Денвер → I-70 до Чикаго\nВариант 2: I-10 East → I-40 East → I-55 North до Чикаго\nКакой рекомендовать?',
            options: [
              'Вариант 1 — прямее через Денвер',
              'Вариант 2 — I-40 обходит опасные горные перевалы I-70 к западу от Денвера; в ноябре это более безопасный и надёжный выбор',
              'Вариант 1 — I-70 в целом более скоростная трасса',
              'Оба маршрута одинаково безопасны в ноябре',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q19',
            text: 'Мини-кейс: Водитель доставил груз в Майами, FL (ET) в четверг в 15:00. Найден груз: Miami → Los Angeles, CA (PT) — 2 750 миль, $4 100, загрузка пятница 8:00 ET. У водителя 8 часов HOS в четверг. Реален ли груз и выгоден ли он?',
            options: [
              'Да, реален и выгоден — $4 100 большая выплата и расписание совпадает',
              'По срокам реален (водитель отдыхает четверг ночью, загружается в пятницу). Но $4 100 ÷ 2 750 = $1.49/миль — ниже среднего для дальнего рейса. Входящий в Калифорнию поток — мягкий рынок. Стоит попробовать поднять ставку перед принятием.',
              'Нереален — водителю нужны 24 часа отдыха после доставки перед любой загрузкой',
              'Выгоден, но нереален — водитель не успеет на загрузку 8:00 пятницы после доставки в 15:00 четверга',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q20',
            text: 'Мини-кейс: Август. Вы диспетчер в Чикаго (CT). Водитель в Лос-Анджелесе (PT), доставка в Нью-Йорке (ET), брокер сказал "среда 6:00 утра". Водитель спрашивает, что это за время. Что отвечаете?',
            options: [
              '"Это 3:00 PT — appointment на 3 часа раньше тихоокеанского времени" — важно только для планирования отъезда из LA',
              '"Доставка в среду в 6:00 ET — когда приедешь в Нью-Йорк, будешь в Eastern Time. Планируй поездку так, чтобы прибыть к 6:00 ET."',
              '"Это 6:00 CT — используй чикагское время как базу"',
              '"Это 9:00 PT — прибавь 3 часа для Западного побережья"',
            ],
            correctIndex: 1,
          },
        ],
      },
    },

    // ─── CHAPTER 3: Equipment Types ───────────────────────────────────────
    '3-1': {
      type: 'text',
      body: `
        <h2>Equipment Types — Introduction</h2>
        <p>As a freight dispatcher, you are responsible for selecting exactly the right equipment for every load. Dispatching the wrong truck creates failed deliveries, angry brokers, wasted driver time, and lasting damage to the carrier's reputation. This chapter builds the equipment knowledge you will apply on every load you ever book.</p>
        <blockquote>
          <strong>Core rule:</strong> Every load has equipment requirements. Every truck has limitations. The dispatcher's job is to match them perfectly — every single time.
        </blockquote>

        <h2>Straight Trucks — Three Main Types</h2>
        <p>Straight trucks are vehicles where the cab and cargo body are built on the same chassis — no separate trailer. They are the primary tools for urban, local, and regional freight where a full semi-truck is too large, too expensive, or physically cannot access the delivery point.</p>

        <h3>1. Cargo Van / Sprinter Van</h3>
        <p>The smallest vehicle in the freight toolkit. Cargo vans — including the widely used Sprinter Van — are enclosed, nimble, and fast. They move through dense city traffic where box trucks struggle, and they do not require a CDL in standard configurations.</p>
        <ul>
          <li><strong>Pallet capacity:</strong> 2–4 standard pallets (average)</li>
          <li><strong>CDL required:</strong> No</li>
          <li><strong>Best for:</strong> Medical supplies, electronics, small e-commerce shipments, expedited last-mile delivery</li>
        </ul>
        <blockquote>
          <strong>Dispatcher note:</strong> The value here is speed, not volume. Cargo vans are ideal for time-sensitive, low-volume freight — especially in urban areas where every minute matters.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Mercedes-Benz Sprinter cargo van" loading="lazy" />
          <figcaption>Cargo Van / Sprinter Van — 2–4 pallets capacity, no CDL required, ideal for urban last-mile and expedited freight</figcaption>
        </figure>

        <h3>2. Box Truck 16ft (Small Straight)</h3>
        <p>The standard mid-size delivery vehicle. You will see this truck on every commercial block — restaurant supply runs, furniture deliveries, local retail restocking. It moves meaningful freight volume while still fitting in tight city streets and residential zones.</p>
        <ul>
          <li><strong>Pallet capacity:</strong> 6–8 standard pallets (average)</li>
          <li><strong>CDL required:</strong> Generally no (under 26,001 lbs GVWR)</li>
          <li><strong>Best for:</strong> Food service, furniture, appliances, local distribution</li>
        </ul>
        <blockquote>
          <strong>Dispatcher note:</strong> The 16ft box truck is the most versatile straight truck — large enough for real freight volume, small enough to access most delivery locations.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck 16ft straight truck" loading="lazy" />
          <figcaption>Box Truck 16ft — 6–8 pallets, the most common straight truck for urban and suburban commercial deliveries</figcaption>
        </figure>

        <h3>3. Box Truck 24ft / 26ft (Large Straight)</h3>
        <p>The largest straight truck available without a full tractor-trailer setup. When a shipper needs serious volume delivered locally or regionally — without the cost or complexity of a semi — this is the go-to vehicle.</p>
        <ul>
          <li><strong>Pallet capacity:</strong> 12–14 standard pallets (average)</li>
          <li><strong>CDL required:</strong> Depends on GVWR — vehicles over 26,001 lbs require minimum CDL Class B</li>
          <li><strong>Best for:</strong> Regional distribution, trade shows, event freight, large appliances, industrial deliveries</li>
        </ul>
        <blockquote>
          <strong>Dispatcher warning:</strong> Always verify your driver's CDL status before booking a load on a 24ft/26ft truck that requires CDL. Dispatching an unlicensed driver is a federal compliance violation and direct carrier liability.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Large box truck 24ft 26ft straight truck" loading="lazy" />
          <figcaption>Box Truck 24ft/26ft — 12–14 pallets, CDL Class B required above 26,001 lbs GVWR, the largest straight truck without a trailer</figcaption>
        </figure>

        <h2>Key Truck Features and Accessories</h2>
        <p>Knowing the truck type is step one. Knowing what accessories are equipped — and what the job requires — is step two. Brokers list feature requirements in load postings and ask about them directly on calls. Getting this wrong causes delivery failures.</p>

        <h3>Ramps</h3>
        <p>Portable metal ramps that attach to the truck's rear, allowing cargo to be rolled or wheeled in and out without a dock or liftgate. Common on jobsite deliveries and locations without any loading infrastructure.</p>

        <h3>Pallet Jack (PJ)</h3>
        <p>A manual hydraulic tool that lifts pallets off the ground so they can be rolled across flat surfaces. Essential when the pickup or delivery location has no forklift. Many experienced drivers carry one as standard equipment — but not all. Always confirm before booking a load that requires one.</p>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Pallet jack in warehouse aisle" loading="lazy" />
          <figcaption>Pallet Jack (PJ) — a manual hydraulic tool for moving pallets when no forklift is available. Always confirm the driver has one before booking a PJ-required load</figcaption>
        </figure>

        <h3>Liftgate (LG)</h3>
        <p>A hydraulic platform mounted at the truck's rear. It lowers flat to ground level, accepts the freight, and raises it up to truck floor height — enabling loading and unloading without a dock or forklift. This is the most frequently required accessory in straight truck dispatching.</p>
        <blockquote>
          <strong>Key detail:</strong> Liftgate service adds an accessorial fee — typically $75–$150. Always confirm this fee is included in the agreed rate before booking. If the broker's rate doesn't include it and the delivery requires one, you are eating that cost.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Hydraulic liftgate on a truck trailer" loading="lazy" />
          <figcaption>Liftgate (LG) — a hydraulic platform that raises freight from ground level to truck floor. The most frequently required accessory for residential and non-dock deliveries</figcaption>
        </figure>

        <h3>Bulkhead</h3>
        <p>A solid partition at the front of the cargo area, separating freight from the cab. It protects the driver if cargo shifts during hard braking. On straight trucks, the bulkhead is typically built into the body — it's a standard safety feature, not optional.</p>

        <h3>Personal Protective Equipment (PPE)</h3>
        <p>Safety gear required by certain facilities before a driver can enter the dock area. Standard PPE includes a high-visibility vest, steel-toed boots, hard hat, and gloves. Manufacturing plants, warehouses, and industrial sites frequently enforce PPE policies at the gate. A driver who shows up without required PPE will be turned away — missing the appointment window and triggering a service failure.</p>
        <blockquote>
          <strong>Dispatcher action:</strong> When booking at any industrial or large warehouse facility — confirm PPE requirements and ensure the driver has the gear before they leave the yard.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/8487733/pexels-photo-8487733.jpeg?w=800" alt="PPE safety equipment requirement sign" loading="lazy" />
          <figcaption>PPE (Personal Protective Equipment) — many industrial facilities require hard hat, safety vest, and steel-toed boots before a driver can enter the dock area</figcaption>
        </figure>

        <h3>Load Bars (Cargo Bars)</h3>
        <p>Adjustable metal bars that brace across the cargo area width, preventing freight from shifting in transit. Placed between walls, bulkhead, and pallet rows to lock the load in place. Improperly secured freight damages cargo, exposes the driver to liability, and can result in a failed DOT roadside inspection.</p>

        <h2>What This Means for Your Daily Work</h2>
        <p>Equipment knowledge shows up on every load call you make. A broker asks: "Does your driver have a liftgate?" — you need a definitive answer. A load posting says "24ft with PJ required" — you verify before booking, not after the driver arrives. A residential delivery with no liftgate ends in a failed delivery, detention charges, and a broker complaint.</p>
        <p>Professional dispatchers know their drivers' equipment before the load ever comes up. Build this knowledge and this habit from day one.</p>
      `,
      bodyRu: `
        <h2>Типы оборудования — Введение</h2>
        <p>Как диспетчер, вы отвечаете за выбор правильного оборудования для каждого груза. Ошибка означает сорванную доставку, недовольного брокера, потерянное время водителя и повреждённую репутацию перевозчика. В этой главе вы получите знания об оборудовании, которые будете применять при работе с каждым грузом.</p>
        <blockquote>
          <strong>Главное правило:</strong> У каждого груза есть требования к оборудованию. У каждого грузовика — свои ограничения. Задача диспетчера — идеально совмещать их каждый раз.
        </blockquote>

        <h2>Прямые грузовики — три основных типа</h2>
        <p>Прямые грузовики (straight trucks) — транспортные средства, у которых кабина и кузов установлены на одном шасси, без отдельного прицепа. Это главные инструменты для городских и региональных перевозок там, где полноценный полуприцеп слишком велик, слишком дорог или физически не проедет к точке доставки.</p>

        <h3>1. Cargo Van / Sprinter Van (фургон)</h3>
        <p>Наименьший автомобиль в арсенале диспетчера. Cargo Van и Sprinter Van — закрытые, манёвренные и быстрые. Они работают в плотном городском трафике, где box truck не пройдёт, и в стандартных конфигурациях не требуют CDL.</p>
        <ul>
          <li><strong>Вместимость поддонов:</strong> 2–4 стандартных поддона (в среднем)</li>
          <li><strong>CDL необходим:</strong> Нет</li>
          <li><strong>Лучше всего для:</strong> Медикаменты, электроника, мелкие e-commerce посылки, срочная доставка последней мили</li>
        </ul>
        <blockquote>
          <strong>Заметка диспетчера:</strong> Ценность здесь — скорость, а не объём. Cargo Van идеален для срочных, малообъёмных грузов, особенно в плотной городской застройке.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Cargo Van Sprinter Van" loading="lazy" />
          <figcaption>Cargo Van / Sprinter Van — вместимость 2–4 поддона, CDL не требуется, идеален для срочных городских доставок</figcaption>
        </figure>

        <h3>2. Box Truck 16ft (малый прямой грузовик)</h3>
        <p>Стандартный грузовик средних размеров. Его видно на каждой городской улице — развоз по ресторанам, доставка мебели, пополнение розничных магазинов. Перевозит значимый объём груза и при этом проходит в узкие коммерческие и жилые зоны.</p>
        <ul>
          <li><strong>Вместимость поддонов:</strong> 6–8 стандартных поддонов (в среднем)</li>
          <li><strong>CDL необходим:</strong> Как правило, нет (GVWR до 26 001 фунта)</li>
          <li><strong>Лучше всего для:</strong> Общепит, мебель, бытовая техника, местная дистрибуция</li>
        </ul>
        <blockquote>
          <strong>Заметка диспетчера:</strong> Box Truck 16ft — самый универсальный прямой грузовик: достаточно большой для реального объёма, достаточно маленький для большинства точек доставки.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box Truck 16ft прямой грузовик" loading="lazy" />
          <figcaption>Box Truck 16ft — 6–8 поддонов, самый распространённый прямой грузовик для городских и пригородных коммерческих доставок</figcaption>
        </figure>

        <h3>3. Box Truck 24ft / 26ft (большой прямой грузовик)</h3>
        <p>Самый крупный прямой грузовик без полноценного тягача с прицепом. Когда грузоотправителю нужен серьёзный объём для локальной или региональной доставки — это решение.</p>
        <ul>
          <li><strong>Вместимость поддонов:</strong> 12–14 стандартных поддонов (в среднем)</li>
          <li><strong>CDL необходим:</strong> Зависит от GVWR — транспортные средства свыше 26 001 фунта требуют минимум CDL класса B</li>
          <li><strong>Лучше всего для:</strong> Региональная дистрибуция, выставочные грузы, крупная бытовая техника</li>
        </ul>
        <blockquote>
          <strong>Предупреждение диспетчеру:</strong> Всегда проверяйте CDL водителя перед бронированием груза на 24ft/26ft, требующего прав. Это федеральное нарушение и прямая ответственность перевозчика.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box Truck 24ft 26ft большой прямой грузовик" loading="lazy" />
          <figcaption>Box Truck 24ft/26ft — 12–14 поддонов, при GVWR свыше 26 001 фунта требуется CDL класса B — самый крупный прямой грузовик без прицепа</figcaption>
        </figure>

        <h2>Ключевые функции и дополнения</h2>
        <p>Знать тип грузовика — шаг первый. Знать, какое дополнительное оснащение имеется и что требует груз — шаг второй. Брокеры указывают требования к оснащению в объявлениях и спрашивают напрямую. Ошибка здесь — сорванная доставка.</p>

        <h3>Пандусы (Ramps)</h3>
        <p>Переносные металлические пандусы, крепящиеся к задней части грузовика. Позволяют закатывать или завозить груз без дока и лифтгейта. Распространены на объектах без погрузочной инфраструктуры.</p>

        <h3>Гидравлическая тележка (Pallet Jack, PJ)</h3>
        <p>Ручной гидравлический инструмент для подъёма и перемещения поддонов по ровной поверхности. Необходим там, где нет погрузчика. Многие опытные водители возят её с собой — но не все. Всегда уточняйте до бронирования груза, требующего PJ.</p>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Гидравлическая тележка pallet jack на складе" loading="lazy" />
          <figcaption>Pallet Jack (PJ) — ручная гидравлическая тележка для перемещения поддонов без погрузчика. Всегда уточняйте наличие у водителя до бронирования</figcaption>
        </figure>

        <h3>Лифтгейт (Liftgate, LG)</h3>
        <p>Гидравлическая платформа на задней части грузовика. Опускается на уровень земли, принимает груз и поднимает его до уровня пола кузова — без дока и погрузчика. Это наиболее часто требуемое дополнение при диспетчировании прямых грузовиков.</p>
        <blockquote>
          <strong>Важная деталь:</strong> Использование лифтгейта добавляет дополнительный сбор — как правило $75–$150. Всегда проверяйте, включён ли он в согласованную ставку до подтверждения груза.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Лифтгейт гидравлическая платформа на грузовике" loading="lazy" />
          <figcaption>Лифтгейт (LG) — гидравлическая платформа на задней части грузовика. Наиболее часто требуемое дополнение при доставке в жилую зону и на объекты без дока</figcaption>
        </figure>

        <h3>Перегородка (Bulkhead)</h3>
        <p>Прочная перегородка в передней части грузового отсека, отделяющая груз от кабины водителя. Защищает водителя при смещении груза во время резкого торможения. В прямых грузовиках bulkhead обычно встроен в конструкцию кузова.</p>

        <h3>Средства индивидуальной защиты (PPE)</h3>
        <p>Защитное снаряжение, требуемое рядом объектов для допуска водителя в зону дока. Стандартный набор: светоотражающий жилет, ботинки со стальным носком, каска и перчатки. Производственные предприятия и крупные склады строго соблюдают эти требования. Водитель без PPE не будет допущен — пропустит окно доставки и спровоцирует срыв.</p>
        <blockquote>
          <strong>Действие диспетчера:</strong> При бронировании груза на промышленный или складской объект — уточняйте требования к PPE и убеждайтесь, что водитель взял снаряжение до отъезда.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/8487733/pexels-photo-8487733.jpeg?w=800" alt="Знак обязательного использования PPE на производственном объекте" loading="lazy" />
          <figcaption>PPE (средства индивидуальной защиты) — многие промышленные объекты требуют каску, светоотражающий жилет и ботинки со стальным носком для допуска в зону дока</figcaption>
        </figure>

        <h3>Стяжные штанги (Load Bars)</h3>
        <p>Регулируемые металлические штанги, распираемые поперёк грузового отсека для фиксации груза. Устанавливаются между стенами, перегородкой и рядами поддонов. Незафиксированный груз повреждается, водитель несёт ответственность, а при проверке DOT — штраф.</p>

        <h2>Что это значит в ежедневной работе</h2>
        <p>Знание оборудования необходимо при каждом звонке брокеру. Брокер спрашивает: «У вашего водителя есть лифтгейт?» — нужен чёткий ответ. В объявлении написано «24ft с PJ обязателен» — проверяете до бронирования, а не после приезда водителя. Доставка в жилую зону без лифтгейта — сорванная доставка, detention time и жалоба брокера.</p>
        <p>Профессиональный диспетчер знает оборудование своих водителей ещё до того, как появился груз. Выработайте эту привычку с первого дня.</p>
      `,
      quiz: {
        questions: [
          { id: 'eq-q1', text: 'How many standard pallets can a Cargo Van / Sprinter Van carry on average?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-q2', text: 'What does "LG" mean in a broker\'s load requirements?', options: ['Long Haul', 'Liftgate', 'Load Gate', 'Logistics Grade'], correctIndex: 1 },
          { id: 'eq-q3', text: 'Which straight truck type generally does NOT require a CDL?', options: ['Box Truck 26ft over 26,001 lbs GVWR', 'Box Truck 24ft requiring CDL Class B', 'Cargo Van under 10,001 lbs GVWR', 'Semi-truck tractor-trailer'], correctIndex: 2 },
          { id: 'eq-q4', text: 'What is a Pallet Jack (PJ) used for?', options: ['Locking the truck\'s rear cargo door', 'Manually lifting and moving pallets when no forklift is available', 'Measuring pallet dimensions before loading', 'Connecting the trailer hitch to the tractor'], correctIndex: 1 },
          { id: 'eq-q5', text: 'What is the average pallet capacity of a Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '18–20'], correctIndex: 1 },
          { id: 'eq-q6', text: 'What is the primary function of Load Bars in a truck?', options: ['Extending the truck\'s maximum cargo length', 'Preventing freight from shifting during transit', 'Measuring the weight distribution across the load', 'Locking the rear doors from inside'], correctIndex: 1 },
          { id: 'eq-q7', text: 'Which truck can carry 12–14 standard pallets on average?', options: ['Sprinter Van', 'Box Truck 16ft', 'Box Truck 24ft / 26ft', 'Cargo Van'], correctIndex: 2 },
          { id: 'eq-q8', text: 'What is a Bulkhead in a straight truck?', options: ['A hydraulic platform that raises freight to truck floor level', 'An internal partition separating the cargo area from the cab', 'A portable loading ramp for non-dock deliveries', 'A weight sensor built into the truck bed'], correctIndex: 1 },
          { id: 'eq-q9', text: 'Why must a dispatcher confirm PPE requirements before a driver\'s appointment?', options: ['PPE affects the truck\'s legal weight limit', 'Facilities turn away drivers without required PPE, causing missed appointment windows', 'PPE is only required for hazardous materials shipments', 'PPE compliance is a billing requirement for the broker'], correctIndex: 1 },
          { id: 'eq-q10', text: 'Ramps are most useful when a delivery location has:', options: ['A high-bay loading dock', 'No dock and no liftgate, but cargo can be wheeled or rolled out', 'A forklift available at all times', 'Heavy palletized freight requiring hydraulic lift'], correctIndex: 1 },
          { id: 'eq-q11', text: 'Mini-case: A broker has a load — 10 pallets, delivery to a strip mall with no loading dock and no forklift. What equipment do you need?', options: ['Cargo Van — most flexible for tight locations', 'Box Truck 16ft — 6–8 pallets is close enough', 'Box Truck 24ft/26ft with Liftgate — handles 10 pallets and unloads without dock', 'Box Truck 16ft with Ramps only — driver can roll pallets out'], correctIndex: 2 },
          { id: 'eq-q12', text: 'Mini-case: Your driver has a Cargo Van. A broker offers a load: 6 pallets, 500 lbs each, pickup today. What is your call?', options: ['Accept — vans handle any pallets if they are light enough', 'Decline — a cargo van holds 2–4 pallets on average; 6 pallets exceeds its capacity', 'Accept — 500 lbs per pallet is under the weight limit so dimensions do not matter', 'Accept with ramps — ramps let you load extra pallets on the bumper'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-q1', text: 'Сколько стандартных поддонов в среднем вмещает Cargo Van / Sprinter Van?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-q2', text: 'Что означает аббревиатура "LG" в требованиях брокера к грузу?', options: ['Long Haul (дальний рейс)', 'Liftgate (лифтгейт)', 'Load Gate (грузовые ворота)', 'Logistics Grade (класс логистики)'], correctIndex: 1 },
          { id: 'eq-q3', text: 'Какой тип прямого грузовика, как правило, не требует прав CDL?', options: ['Box Truck 26ft с GVWR более 26 001 фунта', 'Box Truck 24ft с CDL класса B', 'Cargo Van с GVWR до 10 001 фунта', 'Полуприцеп-тягач'], correctIndex: 2 },
          { id: 'eq-q4', text: 'Для чего используется Pallet Jack (PJ)?', options: ['Блокировки задней двери кузова', 'Ручного подъёма и перемещения поддонов при отсутствии погрузчика', 'Измерения габаритов поддона перед погрузкой', 'Присоединения прицепа к тягачу'], correctIndex: 1 },
          { id: 'eq-q5', text: 'Какова средняя вместимость поддонов Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '18–20'], correctIndex: 1 },
          { id: 'eq-q6', text: 'Каково основное назначение стяжных штанг (Load Bars)?', options: ['Увеличение максимальной длины грузового отсека', 'Предотвращение смещения груза в пути', 'Измерение распределения веса по грузу', 'Блокировка задних дверей изнутри'], correctIndex: 1 },
          { id: 'eq-q7', text: 'Какой грузовик вмещает в среднем 12–14 стандартных поддонов?', options: ['Sprinter Van', 'Box Truck 16ft', 'Box Truck 24ft / 26ft', 'Cargo Van'], correctIndex: 2 },
          { id: 'eq-q8', text: 'Что такое Bulkhead в прямом грузовике?', options: ['Гидравлическая платформа, поднимающая груз до уровня пола', 'Внутренняя перегородка, отделяющая грузовой отсек от кабины', 'Переносной пандус для доставки без дока', 'Встроенный датчик веса в полу кузова'], correctIndex: 1 },
          { id: 'eq-q9', text: 'Почему важно заранее уточнять требования к PPE перед приездом водителя?', options: ['PPE влияет на допустимую полную массу грузовика', 'Объекты не допускают водителей без PPE — пропускается окно доставки', 'PPE требуется только для опасных грузов', 'Это требование выставления счёта брокеру'], correctIndex: 1 },
          { id: 'eq-q10', text: 'Пандусы наиболее полезны, когда в точке доставки:', options: ['Есть высокий погрузочный док', 'Нет дока и лифтгейта, но груз можно выкатить', 'Постоянно доступен погрузчик', 'Требуется гидравлический подъём тяжёлых поддонов'], correctIndex: 1 },
          { id: 'eq-q11', text: 'Мини-кейс: Брокер предлагает груз — 10 поддонов, доставка в торговый центр без дока и без погрузчика. Какое оборудование необходимо?', options: ['Cargo Van — самый гибкий для небольших мест', 'Box Truck 16ft — 6–8 поддонов достаточно близко', 'Box Truck 24ft/26ft с лифтгейтом — вмещает 10 поддонов и выгрузит без дока', 'Box Truck 16ft с пандусами — водитель выкатит поддоны'], correctIndex: 2 },
          { id: 'eq-q12', text: 'Мини-кейс: Ваш водитель управляет Cargo Van. Брокер предлагает 6 поддонов по 500 фунтов каждый. Ваше решение?', options: ['Принять — фургоны справляются с любым числом поддонов, если они лёгкие', 'Отказать — cargo van вмещает 2–4 поддона в среднем; 6 превышает вместимость', 'Принять — 500 фунтов на поддон ниже лимита, размер не имеет значения', 'Принять с пандусами — так можно загрузить лишние поддоны снаружи'], correctIndex: 1 },
        ],
      },
    },

    '3-2': {
      type: 'text',
      body: `
        <h2>Equipment Types — Deep Dive for Dispatchers</h2>
        <p>Knowing the names of truck types is not enough. A working dispatcher needs to understand CDL requirements, GVWR thresholds, accessorial charges, how equipment affects rate negotiation, and how to read load requirements the moment they appear on the load board. This lesson covers all of it.</p>

        <h2>CDL Requirements — The Legal Framework</h2>
        <p>CDL (Commercial Driver's License) requirements are set by federal law and enforced by DOT. As a dispatcher, you are responsible for ensuring the driver you book has the correct license for the truck being operated.</p>

        <h3>GVWR — Gross Vehicle Weight Rating</h3>
        <p>The single most important number when determining CDL requirements is <strong>GVWR (Gross Vehicle Weight Rating)</strong> — the maximum total weight the vehicle is designed to handle, including the truck itself, fuel, driver, and cargo. This is stamped on the vehicle door frame.</p>
        <blockquote>
          <strong>CDL thresholds:</strong><br/>
          Under 10,001 lbs GVWR — No CDL required (Cargo Van, Sprinter Van)<br/>
          10,001–26,000 lbs GVWR — Standard driver's license (Box Truck 16ft in most configurations)<br/>
          Over 26,001 lbs GVWR — <strong>CDL Class B minimum required</strong> (heavier Box Trucks 24ft/26ft)<br/>
          Tractor-trailer combinations — <strong>CDL Class A required</strong>
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck 24/26ft" loading="lazy" />
          <figcaption>A 24–26ft box truck — vehicles in this class often cross the 26,001 lb GVWR threshold that requires CDL Class B</figcaption>
        </figure>

        <p>The 26,001 lb threshold is the critical line. A 26ft box truck rated at 24,000 lbs GVWR doesn't require CDL. The same truck rated at 27,000 lbs does. <strong>Never assume — always check the GVWR on the specific vehicle.</strong></p>

        <h2>When to Use Each Truck — Dispatcher Decision Framework</h2>
        <p>The right equipment decision comes down to four factors: freight volume (pallets/weight), delivery location access, dock availability, and budget.</p>

        <h3>Cargo Van — When to Choose It</h3>
        <ul>
          <li>Freight is 1–4 pallets or equivalent small volume</li>
          <li>Speed is the priority — time-sensitive, expedited, or hot loads</li>
          <li>Urban delivery where box trucks can't access</li>
          <li>Rate is per-mile or flat and doesn't justify larger equipment</li>
        </ul>

        <h3>Box Truck 16ft — When to Choose It</h3>
        <ul>
          <li>Freight is 5–8 pallets</li>
          <li>Delivery in areas with mixed access — part city, part suburban</li>
          <li>Driver doesn't have CDL Class B</li>
          <li>Load requires liftgate but volume doesn't justify a 24ft/26ft</li>
        </ul>

        <h3>Box Truck 24ft/26ft — When to Choose It</h3>
        <ul>
          <li>Freight is 10–14 pallets</li>
          <li>Regional delivery (100–500 mile radius)</li>
          <li>Shipper needs full truck capacity without a semi-truck</li>
          <li>Driver has CDL Class B — confirmed</li>
        </ul>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Sprinter cargo van — no CDL required" loading="lazy" />
          <figcaption>A Sprinter/cargo van — GVWR under 10,001 lbs requires no CDL, making it the most accessible vehicle type for new drivers entering the market</figcaption>
        </figure>

        <h2>Accessorial Charges — The Hidden Rate Factors</h2>
        <p>Accessorial charges are extra fees added to the base rate for services beyond standard point-to-point delivery. They are a frequent source of disputes between brokers and carriers. A dispatcher who doesn't account for accessorials loses money on loads that look profitable on paper.</p>

        <h3>Liftgate Fee</h3>
        <p>Charged when a liftgate is used for loading or unloading. Standard range: <strong>$75–$150 per stop</strong>. If the load has both a pickup without dock AND a delivery without dock, you may be charged at both ends. Confirm with the broker upfront: "Is liftgate service included in the rate?" If not — negotiate it in.</p>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Truck liftgate in use" loading="lazy" />
          <figcaption>A hydraulic liftgate lowering freight to ground level — essential for deliveries without a loading dock</figcaption>
        </figure>

        <h3>Residential Delivery Fee</h3>
        <p>Charged when delivering to a private residence. Residential deliveries take longer (no dock, narrow streets, parking difficulty), and brokers price for this. Standard range: <strong>$50–$100 extra</strong>. When you see a residential ZIP code on the load posting, this fee should be part of the conversation.</p>

        <h3>Inside Delivery Fee</h3>
        <p>Charged when the driver is required to bring freight inside the building — not just to the dock or doorstep. Common for furniture, appliances, and medical equipment. Range: <strong>$50–$150</strong>. Never assume the driver is required to do inside delivery unless the rate con explicitly says so — and confirms the fee.</p>

        <h3>Detention Time</h3>
        <p>When a driver arrives on time but is held at a facility beyond the agreed free-time window (typically 1–2 hours), detention pay kicks in. Standard rate: <strong>$50–$75 per hour</strong> after the free period. Dispatchers must track detention situations and bill the broker immediately — most brokers won't pay unless it's reported and documented promptly.</p>

        <h2>Reading Load Board Equipment Requirements</h2>
        <p>When you see a load on DAT or Truckstop, the equipment field uses shorthand. Learn these immediately — you'll see them on every search:</p>
        <blockquote>
          <strong>SB</strong> — Straight Box (any box truck)<br/>
          <strong>CV</strong> — Cargo Van<br/>
          <strong>SPR</strong> — Sprinter Van<br/>
          <strong>LG</strong> — Liftgate required<br/>
          <strong>PJ</strong> — Pallet Jack required<br/>
          <strong>RA</strong> — Ramps required<br/>
          <strong>PPE</strong> — PPE required at facility<br/>
          <strong>RESI</strong> — Residential delivery<br/>
          <strong>INSIDER</strong> or <strong>ID</strong> — Inside delivery required
        </blockquote>
        <p>A load posting that reads "26ft SB / LG / RESI" means: Box truck 26ft, liftgate required, residential delivery. Before you call the broker on this load, you need to confirm: Does your driver have a 26ft truck? Does it have a liftgate? Are all accessorial fees included in the posted rate?</p>

        <h2>Equipment and Rate Negotiation</h2>
        <p>Equipment directly affects what you can charge. Specialized equipment — liftgate, pallet jack, CDL driver — commands a higher rate. When negotiating, always reference the equipment your driver brings to the table:</p>
        <blockquote>
          <em>"My driver has a 26ft box truck with liftgate and pallet jack, CDL Class B. For a residential delivery with those requirements, I need $2,400 to make this work — not $1,900."</em>
        </blockquote>
        <p>Brokers know that finding a qualified driver for a liftgate/residential delivery on short notice is not easy. That gives you leverage. Use it.</p>

        <h2>Common Equipment Dispatching Mistakes</h2>
        <ul>
          <li><strong>Booking a load without confirming liftgate:</strong> Driver arrives at residential delivery — no liftgate, freight can't be unloaded. Service failure, possible chargeback.</li>
          <li><strong>Missing CDL verification:</strong> Driver operates a truck over 26,001 lbs GVWR without CDL Class B. Federal violation, insurance nullified.</li>
          <li><strong>Ignoring accessorial fees:</strong> Load pays $1,800. Driver uses liftgate, residential address, inside delivery. After fees, net is $1,500. Dispatcher didn't account for this.</li>
          <li><strong>Assuming PJ is standard:</strong> Load requires pallet jack. Driver doesn't have one. Consignee has no forklift. Freight sits on the truck.</li>
          <li><strong>Not confirming PPE:</strong> Driver turned away at gate. Appointment missed. Broker files a service failure report on the carrier.</li>
        </ul>
      `,
      bodyRu: `
        <h2>Типы оборудования — Углублённый курс для диспетчера</h2>
        <p>Знать названия типов грузовиков недостаточно. Работающий диспетчер должен понимать требования к CDL, пороги GVWR, дополнительные сборы (accessorials), влияние оборудования на переговоры о ставке и уметь мгновенно читать требования из объявления на бирже грузов. Этот урок охватывает всё это.</p>

        <h2>Требования к CDL — правовая база</h2>
        <p>Требования к CDL (Commercial Driver's License) установлены федеральным законом и контролируются DOT. Диспетчер несёт ответственность за то, чтобы у водителя были нужные права для управляемого транспортного средства.</p>

        <h3>GVWR — полная разрешённая масса автомобиля</h3>
        <p>Ключевой показатель для определения требований к CDL — <strong>GVWR (Gross Vehicle Weight Rating)</strong>: максимально допустимая полная масса транспортного средства, включая сам грузовик, топливо, водителя и груз. Значение нанесено на дверной стойке автомобиля.</p>
        <blockquote>
          <strong>Пороговые значения CDL:</strong><br/>
          До 10 001 фунта GVWR — CDL не требуется (Cargo Van, Sprinter Van)<br/>
          10 001–26 000 фунтов GVWR — Обычные водительские права (Box Truck 16ft в большинстве конфигураций)<br/>
          Свыше 26 001 фунта GVWR — <strong>Минимум CDL класса B</strong> (тяжёлые Box Truck 24ft/26ft)<br/>
          Сочленённые автопоезда — <strong>Требуется CDL класса A</strong>
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box Truck 24–26 футов" loading="lazy" />
          <figcaption>Box Truck 24–26 футов — автомобили этого класса нередко пересекают порог GVWR 26 001 фунт, при котором требуется CDL класса B</figcaption>
        </figure>

        <p>Порог 26 001 фунта — критическая граница. Box Truck 26ft с GVWR 24 000 фунтов не требует CDL. Тот же грузовик с GVWR 27 000 фунтов — требует. <strong>Никогда не предполагайте — всегда проверяйте GVWR конкретного автомобиля.</strong></p>

        <h2>Когда использовать каждый тип — схема принятия решений</h2>
        <p>Правильный выбор оборудования определяется четырьмя факторами: объём груза (поддоны/вес), доступность точки доставки, наличие дока и бюджет.</p>

        <h3>Cargo Van — когда выбирать</h3>
        <ul>
          <li>Груз: 1–4 поддона или небольшой объём</li>
          <li>Скорость — приоритет: срочный или горячий груз</li>
          <li>Городская доставка, куда box truck не проедет</li>
          <li>Ставка поштучная или фиксированная и не оправдывает крупное ТС</li>
        </ul>

        <h3>Box Truck 16ft — когда выбирать</h3>
        <ul>
          <li>Груз: 5–8 поддонов</li>
          <li>Смешанный доступ — частично городская, частично пригородная зона</li>
          <li>Водитель без CDL класса B</li>
          <li>Груз требует лифтгейта, но объём не оправдывает 24ft/26ft</li>
        </ul>

        <h3>Box Truck 24ft/26ft — когда выбирать</h3>
        <ul>
          <li>Груз: 10–14 поддонов</li>
          <li>Региональная доставка (100–500 миль)</li>
          <li>Грузоотправителю нужен полный объём без полуприцепа</li>
          <li>Водитель имеет CDL класса B — подтверждено</li>
        </ul>

        <figure>
          <img src="https://images.pexels.com/photos/6407437/pexels-photo-6407437.jpeg?w=800" alt="Sprinter cargo van — CDL не требуется" loading="lazy" />
          <figcaption>Sprinter/cargo van — GVWR ниже 10 001 фунта, CDL не нужен: наиболее доступный тип транспорта для водителей без коммерческих прав</figcaption>
        </figure>

        <h2>Дополнительные сборы (Accessorials) — скрытые факторы ставки</h2>
        <p>Accessorial charges — дополнительные сборы к базовой ставке за услуги сверх стандартной перевозки из точки А в точку Б. Они — частый источник споров между брокерами и перевозчиками. Диспетчер, не учитывающий accessorials, теряет деньги на внешне прибыльных грузах.</p>

        <h3>Сбор за лифтгейт (Liftgate Fee)</h3>
        <p>Взимается при использовании лифтгейта на погрузке или выгрузке. Стандартный диапазон: <strong>$75–$150 за остановку</strong>. Если погрузка и выгрузка обе без дока — сбор может взиматься дважды. Всегда уточняйте у брокера: «Входит ли использование лифтгейта в ставку?» Если нет — включите в переговоры.</p>

        <figure>
          <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?w=800" alt="Гидравлический лифтгейт грузовика" loading="lazy" />
          <figcaption>Гидравлический лифтгейт опускает груз на уровень земли — незаменим при доставке без погрузочного дока</figcaption>
        </figure>

        <h3>Сбор за доставку в жилую зону (Residential Delivery Fee)</h3>
        <p>Взимается при доставке по жилому адресу. Такие доставки занимают больше времени (нет дока, узкие улицы, сложная парковка). Диапазон: <strong>$50–$100 дополнительно</strong>. Увидев жилой ZIP-код в объявлении — включите этот сбор в переговоры.</p>

        <h3>Сбор за занос внутрь (Inside Delivery Fee)</h3>
        <p>Взимается, когда водитель обязан занести груз внутрь здания, а не только к двери или доку. Часто требуется при доставке мебели, техники и медицинского оборудования. Диапазон: <strong>$50–$150</strong>. Никогда не предполагайте, что inside delivery входит в задачи водителя, если это не указано в rate con с подтверждением сбора.</p>

        <h3>Оплата за простой (Detention Time)</h3>
        <p>Когда водитель прибывает вовремя, но задерживается сверх бесплатного периода (обычно 1–2 часа), начисляется оплата за простой. Стандартная ставка: <strong>$50–$75 в час</strong> после бесплатного периода. Диспетчер должен фиксировать ситуацию и немедленно выставлять брокеру счёт — большинство брокеров не платят без оперативного уведомления и документального подтверждения.</p>

        <h2>Как читать требования к оборудованию на бирже грузов</h2>
        <p>В объявлениях на DAT и Truckstop используются сокращения. Запомните их — они встречаются в каждом поиске:</p>
        <blockquote>
          <strong>SB</strong> — Straight Box (любой box truck)<br/>
          <strong>CV</strong> — Cargo Van<br/>
          <strong>SPR</strong> — Sprinter Van<br/>
          <strong>LG</strong> — требуется лифтгейт<br/>
          <strong>PJ</strong> — требуется pallet jack<br/>
          <strong>RA</strong> — требуются пандусы<br/>
          <strong>PPE</strong> — PPE обязательно на объекте<br/>
          <strong>RESI</strong> — доставка в жилую зону<br/>
          <strong>INSIDER / ID</strong> — занос груза внутрь обязателен
        </blockquote>
        <p>Объявление «26ft SB / LG / RESI» означает: Box truck 26ft, лифтгейт обязателен, доставка в жилую зону. Прежде чем позвонить брокеру, проверьте: есть ли у вашего водителя 26ft грузовик? Есть ли лифтгейт? Все accessorials включены в ставку?</p>

        <h2>Оборудование и переговоры о ставке</h2>
        <p>Оборудование напрямую влияет на то, что вы можете запросить. Специализированное оснащение — лифтгейт, pallet jack, водитель с CDL — даёт право на более высокую ставку. В переговорах всегда указывайте на оборудование водителя:</p>
        <blockquote>
          <em>«Мой водитель приедет на 26ft box truck с лифтгейтом и pallet jack, CDL класс B. За доставку в жилую зону с такими требованиями мне нужно $2 400, а не $1 900.»</em>
        </blockquote>
        <p>Брокер знает, что найти квалифицированного водителя с лифтгейтом для жилой доставки в срочном режиме непросто. Это ваш рычаг влияния. Используйте его.</p>

        <h2>Типичные ошибки диспетчера при работе с оборудованием</h2>
        <ul>
          <li><strong>Бронирование груза без подтверждения лифтгейта:</strong> Водитель приезжает на жилую доставку без лифтгейта — выгрузка невозможна. Срыв доставки, возможный штраф.</li>
          <li><strong>Пропущенная проверка CDL:</strong> Водитель управляет транспортным средством с GVWR свыше 26 001 фунта без CDL класса B. Федеральное нарушение, страховка аннулируется.</li>
          <li><strong>Игнорирование accessorials:</strong> Груз платит $1 800. Водитель использует лифтгейт, жилая зона, занос внутрь. После вычета сборов остаётся $1 500. Диспетчер не учёл это заранее.</li>
          <li><strong>Предположение о наличии PJ:</strong> Груз требует pallet jack. Водитель его не имеет. Погрузчика у грузополучателя нет. Груз остаётся в кузове.</li>
          <li><strong>Не уточнили PPE:</strong> Водителя не пустили на объект. Окно доставки пропущено. Брокер фиксирует service failure по перевозчику.</li>
        </ul>
      `,
      quiz: {
        questions: [
          { id: 'eq-th-q1', text: 'At what GVWR threshold is CDL Class B the minimum requirement for operating a straight truck?', options: ['Over 10,001 lbs', 'Over 18,001 lbs', 'Over 26,001 lbs', 'Over 33,001 lbs'], correctIndex: 2 },
          { id: 'eq-th-q2', text: 'What does GVWR stand for, and why does it matter for dispatchers?', options: ['Gross Vehicle Width Rating — it determines if the truck fits at a dock', 'Gross Vehicle Weight Rating — it determines CDL requirements for the driver', 'General Vehicle Work Rating — it sets the truck\'s insurance class', 'Gross Vehicle Wheel Rating — it determines tire load capacity'], correctIndex: 1 },
          { id: 'eq-th-q3', text: 'A load posting reads "26ft SB / LG / RESI." What does this mean?', options: ['26ft straight box truck, long-haul rate included, rush delivery', '26ft straight box truck, liftgate required, residential delivery', '26ft semi-box trailer, low-grade freight, refrigerated', '26ft straight box, loading ramps available, standard delivery'], correctIndex: 1 },
          { id: 'eq-th-q4', text: 'What is the standard accessorial fee range for liftgate service per stop?', options: ['$10–$25', '$75–$150', '$200–$300', '$400–$500'], correctIndex: 1 },
          { id: 'eq-th-q5', text: 'A driver arrives on time at a pickup facility but waits 3 hours beyond the 2-hour free period. What should the dispatcher do?', options: ['Wait until delivery is complete before raising the issue', 'Accept the delay — detention is the driver\'s problem to track', 'Document the detention time and bill the broker immediately for hours beyond the free period', 'Cancel the load and find a replacement freight that pays more'], correctIndex: 2 },
          { id: 'eq-th-q6', text: 'What is an "Inside Delivery" fee, and when does it apply?', options: ['A fee for delivering to an address with an interior courtyard', 'An extra charge when the driver is required to bring freight inside the building beyond the dock or doorstep', 'A fee for using the truck\'s interior liftgate system', 'A surcharge for delivering to high-rise buildings with freight elevators'], correctIndex: 1 },
          { id: 'eq-th-q7', text: 'Your driver has a Box Truck 26ft with a GVWR of 27,500 lbs. What license does the driver need to legally operate it?', options: ['Standard driver\'s license — GVWR thresholds only apply to semi-trucks', 'CDL Class A — all commercial trucks require Class A', 'CDL Class B minimum — required for vehicles over 26,001 lbs GVWR', 'CDL Class C — only required for passenger vehicles'], correctIndex: 2 },
          { id: 'eq-th-q8', text: 'When negotiating rate, why does having a liftgate-equipped truck give the dispatcher leverage?', options: ['Liftgate trucks are federally subsidized so brokers must accept higher rates', 'Liftgate-equipped drivers are scarce for certain loads, making it harder for brokers to replace them quickly', 'Liftgates add significant weight that increases fuel costs which justifies higher rates', 'Brokers are legally required to pay a liftgate premium by FMCSA regulation'], correctIndex: 1 },
          { id: 'eq-th-q9', text: 'A load requires a pallet jack. Your driver confirms he does not have one. The consignee has no forklift. What is the correct dispatcher action?', options: ['Book the load and hope the consignee figures out a solution on the day', 'Decline the load or find a driver who has a PJ before committing to the broker', 'Accept the load and negotiate a discount to compensate the consignee', 'Tell the broker PJ is not needed and let the driver handle it on arrival'], correctIndex: 1 },
          { id: 'eq-th-q10', text: 'Which of these loads would most likely generate both a Residential Delivery fee AND a Liftgate fee?', options: ['8 pallets of auto parts, delivery to a distribution center with docks', '4 pallets of appliances, delivery to a private home address, no dock', '12 pallets of produce, delivery to a grocery chain warehouse', '2 pallets of electronics, delivery to a tech company HQ loading dock'], correctIndex: 1 },
          { id: 'eq-th-q11', text: 'Mini-case: A broker posts a load — 10 pallets, Box Truck 26ft required, residential delivery, liftgate required, rate $2,100. Your driver has a 26ft truck with liftgate and CDL Class B. Should you accept at $2,100?', options: ['Yes — $2,100 is solid for a straight truck run', 'Yes — the driver has all required equipment so there\'s no reason to negotiate', 'No — residential + liftgate accessorials ($125+$75) reduce net pay; counter to $2,400 minimum', 'No — you can never accept a residential delivery load under any circumstances'], correctIndex: 2 },
          { id: 'eq-th-q12', text: 'Mini-case: You book a load for a driver with a Box Truck 24ft GVWR 24,500 lbs. Halfway through the route you realize the driver only has a standard license, not CDL. What is the critical issue?', options: ['No issue — 24,500 lbs GVWR is under the 26,001 lb CDL threshold, so no CDL is required', 'Major issue — any straight truck requires CDL Class B regardless of GVWR', 'Minor issue — CDL is only required at delivery locations in certain states', 'Issue only if the truck is fully loaded to max weight'], correctIndex: 0 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-th-q1', text: 'При каком значении GVWR минимально требуется CDL класса B для управления прямым грузовиком?', options: ['Свыше 10 001 фунта', 'Свыше 18 001 фунта', 'Свыше 26 001 фунта', 'Свыше 33 001 фунта'], correctIndex: 2 },
          { id: 'eq-th-q2', text: 'Что означает GVWR и почему это важно для диспетчера?', options: ['Gross Vehicle Width Rating — определяет, войдёт ли грузовик в dok', 'Gross Vehicle Weight Rating — определяет требования к CDL для водителя', 'General Vehicle Work Rating — задаёт страховой класс грузовика', 'Gross Vehicle Wheel Rating — определяет нагрузку на шины'], correctIndex: 1 },
          { id: 'eq-th-q3', text: 'Объявление на бирже грузов: «26ft SB / LG / RESI». Что это означает?', options: ['26ft box truck, ставка за дальний рейс, срочная доставка', '26ft box truck, лифтгейт обязателен, доставка в жилую зону', '26ft полуприцеп, низкосортный груз, рефрижератор', '26ft box truck, пандусы доступны, стандартная доставка'], correctIndex: 1 },
          { id: 'eq-th-q4', text: 'Каков стандартный диапазон accessorial-сбора за лифтгейт за одну остановку?', options: ['$10–$25', '$75–$150', '$200–$300', '$400–$500'], correctIndex: 1 },
          { id: 'eq-th-q5', text: 'Водитель прибыл вовремя на погрузку, но ждал 3 часа после бесплатного периода в 2 часа. Что должен сделать диспетчер?', options: ['Подождать окончания доставки и только потом поднимать вопрос', 'Принять задержку — detention time — проблема водителя', 'Зафиксировать время простоя и немедленно выставить брокеру счёт за часы сверх бесплатного периода', 'Отменить груз и найти более выгодный'], correctIndex: 2 },
          { id: 'eq-th-q6', text: 'Что такое сбор за "Inside Delivery" и когда он применяется?', options: ['Сбор за доставку на адрес с внутренним двором', 'Доплата, когда водитель обязан занести груз внутрь здания, а не только к доку или двери', 'Сбор за использование внутренней лифтейтовой системы грузовика', 'Наценка за доставку в высотные здания с грузовыми лифтами'], correctIndex: 1 },
          { id: 'eq-th-q7', text: 'У вашего водителя Box Truck 26ft с GVWR 27 500 фунтов. Какие права ему нужны?', options: ['Обычные водительские права — пороги GVWR применяются только к полуприцепам', 'CDL класса A — все коммерческие грузовики требуют класс A', 'Минимум CDL класса B — обязателен для ТС свыше 26 001 фунта GVWR', 'CDL класса C — требуется только для пассажирских ТС'], correctIndex: 2 },
          { id: 'eq-th-q8', text: 'Почему наличие грузовика с лифтгейтом даёт диспетчеру преимущество в переговорах?', options: ['Грузовики с лифтгейтом субсидируются государством, поэтому брокеры обязаны принимать более высокие ставки', 'Водители с лифтгейтом редки для определённых грузов, и брокеру сложнее быстро найти замену', 'Лифтгейт добавляет значительный вес, увеличивая расход топлива, что оправдывает более высокую ставку', 'Брокеры по правилам FMCSA обязаны доплачивать за наличие лифтгейта'], correctIndex: 1 },
          { id: 'eq-th-q9', text: 'Груз требует pallet jack. Водитель подтверждает, что у него нет PJ. У грузополучателя нет погрузчика. Ваши действия?', options: ['Забронировать груз и надеяться, что грузополучатель найдёт решение в день доставки', 'Отказаться от груза или найти водителя с PJ до подтверждения брокеру', 'Принять груз и договориться о скидке для компенсации грузополучателю', 'Сказать брокеру, что PJ не нужен, и оставить решение водителю'], correctIndex: 1 },
          { id: 'eq-th-q10', text: 'Какой из этих грузов с наибольшей вероятностью породит и Residential Delivery Fee, и Liftgate Fee?', options: ['8 поддонов автозапчастей, доставка в дистрибьюторский центр с доками', '4 поддона бытовой техники, доставка по частному жилому адресу без дока', '12 поддонов продуктов, доставка на склад сети супермаркетов', '2 поддона электроники, доставка на погрузочный дoк офиса tech-компании'], correctIndex: 1 },
          { id: 'eq-th-q11', text: 'Мини-кейс: Брокер предлагает груз — 10 поддонов, Box Truck 26ft, доставка в жилую зону, лифтгейт обязателен, ставка $2 100. У вашего водителя 26ft с лифтгейтом и CDL класса B. Принять за $2 100?', options: ['Да — $2 100 хорошая ставка для прямого грузовика', 'Да — водитель имеет всё необходимое, смысла торговаться нет', 'Нет — residential + liftgate accessorials ($125+$75) снижают чистую ставку; встречное предложение от $2 400', 'Нет — доставку в жилую зону нельзя принимать ни при каких условиях'], correctIndex: 2 },
          { id: 'eq-th-q12', text: 'Мини-кейс: Вы бронируете груз для водителя на Box Truck 24ft с GVWR 24 500 фунтов. На полпути обнаруживаете, что у водителя только обычные права, без CDL. В чём критическая проблема?', options: ['Никакой проблемы — 24 500 фунтов GVWR ниже порога 26 001 фунта, CDL не требуется', 'Серьёзная проблема — любой прямой грузовик требует CDL класса B вне зависимости от GVWR', 'Незначительная проблема — CDL требуется только в точках доставки определённых штатов', 'Проблема только если грузовик нагружен до максимальной массы'], correctIndex: 0 },
        ],
      },
    },

    '3-3': {
      type: 'text',
      body: `
        <h2>Demo: A Dispatcher's Day with Equipment Decisions</h2>
        <p>This demo follows dispatcher Alex, working from his home office, as he manages a full day of straight-truck freight. Every decision in this walkthrough connects directly back to what you studied in Intro and Theory: truck types, CDL requirements, accessorial charges, and equipment verification. Watch for the moments where the right equipment knowledge saves the load — and where a single missed check causes a crisis.</p>

        <h2>7:45 AM — Morning Equipment Audit</h2>
        <p>Before Alex opens the load board, he does something most beginner dispatchers skip: he checks his drivers' current equipment status.</p>
        <p>He has three drivers today:</p>
        <blockquote>
          <strong>Driver 1 — Marcus:</strong> Box Truck 26ft, GVWR 28,000 lbs, CDL Class B, liftgate installed, has pallet jack. Currently in Dallas, TX.<br/>
          <strong>Driver 2 — Priya:</strong> Box Truck 16ft, GVWR 22,000 lbs, no CDL, no liftgate, has ramps. Currently in Houston, TX.<br/>
          <strong>Driver 3 — Derek:</strong> Cargo Van (Sprinter), no CDL, no liftgate. Currently in Austin, TX.
        </blockquote>
        <p>Alex writes this down. He now knows before any broker call what each driver can and cannot do. This is the foundation of efficient equipment dispatching.</p>
        <blockquote>
          <strong>Professional habit:</strong> Know your fleet equipment profile cold before your first call of the day. Never discover a missing liftgate after you've already committed to a broker.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Pallet jack in a warehouse" loading="lazy" />
          <figcaption>A pallet jack — one of the key tools Alex tracks in his daily equipment audit. Its presence (or absence) can make or break a booking</figcaption>
        </figure>

        <h2>8:20 AM — First Broker Call: The Residential Load</h2>
        <p>Alex finds a load on DAT: <strong>Dallas, TX → San Antonio, TX | 12 pallets | 26ft SB / LG / RESI | $1,650</strong></p>
        <p>He immediately maps this to his fleet: 12 pallets + liftgate + residential = Marcus (26ft, liftgate, CDL). Perfect match. He calls the broker.</p>

        <blockquote>
          <strong>Alex:</strong> "Hi, this is Alex with [Carrier]. I'm calling on the Dallas to San Antonio load — 12 pallets, liftgate, residential. Is it still available?"<br/>
          <strong>Broker:</strong> "Yes, it is. Rate is $1,650."<br/>
          <strong>Alex:</strong> "I have a 26ft box truck with liftgate, CDL Class B driver, available today. The residential delivery with liftgate — is the $75 liftgate accessorial already in that rate?"<br/>
          <strong>Broker:</strong> "No, it's not included."<br/>
          <strong>Alex:</strong> "Then I need $1,800 to make this work. Residential delivery, liftgate at both ends — that's the right number."<br/>
          <strong>Broker:</strong> "I can do $1,750."<br/>
          <strong>Alex:</strong> "Done. Send the rate con."
        </blockquote>

        <p>Alex added $100 by simply knowing to ask about accessorials — a question many dispatchers forget.</p>

        <h2>9:10 AM — Second Load: PPE Requirement Discovered</h2>
        <p>Alex books a second load for Priya: <strong>Houston → Beaumont, TX | 6 pallets | 16ft SB | $820</strong>. Straightforward — fits her 16ft truck perfectly. He sends her the details.</p>
        <p>Ten minutes later, Priya calls back: <em>"Alex, the pickup address is a petrochemical plant. I don't have a hard hat or safety boots."</em></p>
        <p>Alex checks the load posting again. He missed it — buried at the bottom: <strong>PPE required: hard hat, safety vest, steel-toed boots.</strong></p>

        <blockquote>
          <strong>Alex's immediate actions:</strong><br/>
          1. Call the broker — explain the situation, ask if there's a 30-minute window to allow Priya to get PPE from a nearby safety supply store.<br/>
          2. Find the nearest safety supply store to Priya's location — she needs hard hat, vest, and steel-toed boots.<br/>
          3. If the window can't be extended — call the broker and offer Marcus as replacement (he has his own PPE kit).<br/>
          4. <strong>Never send a driver into a facility without PPE. One turned-away driver is painful. A DOT violation or injury is catastrophic.</strong>
        </blockquote>

        <p>The broker extends the window by 45 minutes. Priya gets the gear. Delivery happens. Alex notes in his records: <em>"Always check facility type for PPE requirements before confirming pickup appointment."</em></p>

        <figure>
          <img src="https://images.pexels.com/photos/8487733/pexels-photo-8487733.jpeg?w=800" alt="Personal Protective Equipment" loading="lazy" />
          <figcaption>PPE required at many industrial facilities — hard hat, safety vest, and steel-toed boots must be confirmed before the driver's appointment</figcaption>
        </figure>

        <h2>11:30 AM — Third Load: The Equipment Trap</h2>
        <p>A broker calls Alex directly with an off-board load — they need coverage fast.</p>
        <p>Broker: <em>"I've got a load — Austin to Houston, 3 pallets, today, $450. Small stuff, just needs a cargo van."</em></p>
        <p>Alex checks: Derek is in Austin, Cargo Van, available now. Seems simple. But before he commits, Alex asks his standard questions:</p>

        <blockquote>
          <em>"What's the delivery location — commercial or residential?"</em><br/>
          Broker: "Residential, it's a home office."<br/>
          <em>"Weight per pallet?"</em><br/>
          Broker: "Around 300 lbs each — it's printer equipment."<br/>
          <em>"Does the delivery require inside delivery or just to the door?"</em><br/>
          Broker: "Inside delivery — second floor, no elevator."
        </blockquote>

        <p>Alex pauses. Residential delivery, inside delivery, second floor, printer equipment. This is not a standard Cargo Van run.</p>
        <p>Issues: (1) Inside delivery fee is not in the $450 rate. (2) Second floor without elevator means significant manual labor — this needs to be confirmed and paid for. (3) $450 for a cargo van run with inside delivery is below market for this complexity.</p>

        <blockquote>
          <strong>Alex:</strong> "The inside delivery on the second floor is not a standard service. I need $600 minimum, and the inside delivery fee of $100 needs to be in the rate con explicitly. Can you confirm that?"<br/>
          <strong>Broker:</strong> "I can do $575 all-in including inside delivery."<br/>
          <strong>Alex:</strong> "Done, but I need that in the rate con — 'inside delivery, 2nd floor' written out. If it's not there, Derek doesn't go past the door."
        </blockquote>

        <p>Alex confirms the load. He also texts Derek: <em>"This is a 2nd floor inside delivery. Rate con will specify it. Do not do any inside delivery if it's not on the rate con."</em></p>

        <h2>2:00 PM — CDL Check at Weigh Station</h2>
        <p>Marcus calls from the road: <em>"Hey, I'm approaching a DOT weigh station checkpoint. Just confirming — my CDL Class B is current, right? The truck is loaded at 24,000 lbs."</em></p>
        <p>Alex checks his records. CDL Class B, valid through next year. GVWR of the truck: 28,000 lbs — Class B required. All good.</p>
        <blockquote>
          <strong>Alex confirms:</strong> "Yes, CDL Class B is current, expires next March. GVWR is 28,000 lbs so Class B covers you. You're good."
        </blockquote>
        <p>This is a routine check — but it illustrates the value of maintaining accurate driver records. A dispatcher who doesn't know their drivers' CDL status is flying blind.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck at delivery location" loading="lazy" />
          <figcaption>A box truck like Marcus's — knowing the GVWR and CDL class for every vehicle in your fleet protects the carrier from federal violations and service failures</figcaption>
        </figure>

        <h2>End of Day — What Alex Did Right</h2>
        <ul>
          <li>Started the day with a full equipment audit across his fleet — knew exactly what each driver could handle before any load came up</li>
          <li>Asked about accessorials on the residential liftgate load before accepting the rate — gained $100</li>
          <li>Caught the PPE requirement issue before the driver was turned away — resolved it proactively</li>
          <li>Identified the inside delivery trap on the cargo van load — negotiated the fee into the rate and documented it on the rate con</li>
          <li>Maintained accurate CDL records — confirmed instantly when Marcus needed verification at the weigh station</li>
        </ul>
        <p>Equipment knowledge doesn't just prevent disasters — it directly generates revenue through confident accessorial negotiation and professional problem-solving.</p>
      `,
      bodyRu: `
        <h2>Демо: рабочий день диспетчера с решением задач по оборудованию</h2>
        <p>Этот демо-урок сопровождает диспетчера Алекса в течение полного рабочего дня с грузами на прямых грузовиках. Каждое решение связано с материалом уроков «Введение» и «Теория»: типы грузовиков, требования к CDL, дополнительные сборы, проверка оборудования. Обратите внимание на моменты, где знание оборудования спасает груз — и где один пропущенный контроль создаёт кризис.</p>

        <h2>7:45 утра — Утренний аудит оборудования</h2>
        <p>Прежде чем открыть биржу грузов, Алекс делает то, что пропускают большинство начинающих диспетчеров: проверяет статус оборудования своих водителей.</p>
        <p>Сегодня у него три водителя:</p>
        <blockquote>
          <strong>Водитель 1 — Маркус:</strong> Box Truck 26ft, GVWR 28 000 фунтов, CDL класса B, лифтгейт установлен, есть pallet jack. Сейчас в Далласе, TX.<br/>
          <strong>Водитель 2 — Прия:</strong> Box Truck 16ft, GVWR 22 000 фунтов, без CDL, без лифтгейта, есть пандусы. Сейчас в Хьюстоне, TX.<br/>
          <strong>Водитель 3 — Дерек:</strong> Cargo Van (Sprinter), без CDL, без лифтгейта. Сейчас в Остине, TX.
        </blockquote>
        <p>Алекс записывает это. Ещё до первого звонка брокеру он знает, что каждый водитель может и чего не может. Это фундамент эффективного диспетчирования по оборудованию.</p>
        <blockquote>
          <strong>Профессиональная привычка:</strong> Знайте оборудование вашего автопарка досконально до первого звонка дня. Никогда не обнаруживайте отсутствие лифтгейта после того, как уже взяли обязательства перед брокером.
        </blockquote>

        <figure>
          <img src="https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?w=800" alt="Рохля (pallet jack) на складе" loading="lazy" />
          <figcaption>Рохля — один из ключевых инструментов, которые Алекс отслеживает при ежедневном аудите. Её наличие или отсутствие может решить судьбу груза</figcaption>
        </figure>

        <h2>8:20 утра — Первый звонок брокеру: жилая доставка</h2>
        <p>Алекс находит груз на DAT: <strong>Даллас → Сан-Антонио | 12 поддонов | 26ft SB / LG / RESI | $1 650</strong></p>
        <p>Он мгновенно сопоставляет с автопарком: 12 поддонов + лифтгейт + жилая зона = Маркус (26ft, лифтгейт, CDL). Идеальное совпадение. Звонит брокеру.</p>

        <blockquote>
          <strong>Алекс:</strong> «Привет, это Алекс с [Carrier]. Звоню по грузу Даллас — Сан-Антонио, 12 поддонов, лифтгейт, жилая зона. Ещё доступен?»<br/>
          <strong>Брокер:</strong> «Да. Ставка $1 650.»<br/>
          <strong>Алекс:</strong> «У меня 26ft с лифтгейтом, водитель с CDL класса B, готов сегодня. Accessorial за лифтгейт $75 — он уже включён в ставку?»<br/>
          <strong>Брокер:</strong> «Нет, не включён.»<br/>
          <strong>Алекс:</strong> «Тогда мне нужно $1 800. Жилая доставка, лифтгейт с обеих сторон — это правильная цифра.»<br/>
          <strong>Брокер:</strong> «Могу $1 750.»<br/>
          <strong>Алекс:</strong> «Договорились. Пришлите rate con.»
        </blockquote>

        <p>Алекс добавил $100, просто зная, что нужно спросить об accessorials — вопрос, который большинство диспетчеров забывают.</p>

        <h2>9:10 утра — Второй груз: обнаруженное требование PPE</h2>
        <p>Алекс бронирует для Прии: <strong>Хьюстон → Бомонт, TX | 6 поддонов | 16ft SB | $820</strong>. Всё просто — идеально подходит для её 16ft. Он отправляет ей детали.</p>
        <p>Через десять минут Прия звонит: <em>«Алекс, адрес пикапа — нефтехимический завод. У меня нет каски и защитных ботинок.»</em></p>
        <p>Алекс перечитывает объявление. Он пропустил — в самом низу: <strong>PPE required: каска, светоотражающий жилет, ботинки со стальным носком.</strong></p>

        <blockquote>
          <strong>Немедленные действия Алекса:</strong><br/>
          1. Позвонить брокеру — объяснить ситуацию, попросить окно 30 минут, пока Прия купит PPE в ближайшем магазине.<br/>
          2. Найти ближайший магазин средств защиты рядом с Прией.<br/>
          3. Если окно нельзя сдвинуть — предложить Маркуса как замену (у него есть свой PPE-комплект).<br/>
          4. <strong>Никогда не отправляйте водителя на объект без PPE. Один отказ в допуске — болезненно. Нарушение DOT или травма — катастрофа.</strong>
        </blockquote>

        <p>Брокер расширяет окно на 45 минут. Прия покупает снаряжение. Доставка состоялась. Алекс делает запись: <em>«Всегда проверять тип объекта на требования PPE до подтверждения окна погрузки.»</em></p>

        <figure>
          <img src="https://images.pexels.com/photos/8487733/pexels-photo-8487733.jpeg?w=800" alt="Средства индивидуальной защиты (СИЗ)" loading="lazy" />
          <figcaption>СИЗ на многих промышленных объектах обязательны — каска, жилет и ботинки со стальным носком нужно подтвердить заранее</figcaption>
        </figure>

        <h2>11:30 утра — Третий груз: ловушка оборудования</h2>
        <p>Брокер звонит Алексу напрямую с грузом без объявления — нужно срочно закрыть.</p>
        <p>Брокер: <em>«Груз — Остин → Хьюстон, 3 поддона, сегодня, $450. Мелочь, нужен просто cargo van.»</em></p>
        <p>Алекс проверяет: Дерек в Остине, Cargo Van, доступен. Кажется просто. Но прежде чем соглашаться, он задаёт стандартные вопросы:</p>

        <blockquote>
          <em>«Куда доставка — коммерческий объект или жилая зона?»</em><br/>
          Брокер: «Жилой адрес, домашний офис.»<br/>
          <em>«Вес каждого поддона?»</em><br/>
          Брокер: «Около 300 фунтов — принтерное оборудование.»<br/>
          <em>«Доставка — только до двери или с заносом внутрь?»</em><br/>
          Брокер: «Занос внутрь — второй этаж, лифта нет.»
        </blockquote>

        <p>Алекс делает паузу. Жилой адрес, занос внутрь, второй этаж, принтерное оборудование. Это не стандартный рейс для Cargo Van.</p>
        <p>Проблемы: (1) Inside delivery fee не включён в ставку $450. (2) Второй этаж без лифта — значительная физическая нагрузка — нужно подтвердить и оплатить. (3) $450 за cargo van с заносом внутрь — ниже рынка для такой сложности.</p>

        <blockquote>
          <strong>Алекс:</strong> «Занос на второй этаж — это не стандартная услуга. Мне нужно минимум $600, и inside delivery fee $100 должен быть явно прописан в rate con. Вы подтверждаете?»<br/>
          <strong>Брокер:</strong> «Могу $575 всё включено, с inside delivery.»<br/>
          <strong>Алекс:</strong> «Договорились — но в rate con должно быть написано "inside delivery, 2nd floor". Если этого нет, Дерек не заходит дальше двери.»
        </blockquote>

        <p>Алекс подтверждает груз. Дереку пишет: <em>«Это занос на 2-й этаж. В rate con будет указано. Без указания в rate con внутрь не заходи.»</em></p>

        <h2>14:00 — Проверка CDL на весовом пункте</h2>
        <p>Маркус звонит с дороги: <em>«Алекс, подъезжаю к весовому пункту DOT. Уточни — мой CDL класс B актуален? Грузовик загружен на 24 000 фунтов.»</em></p>
        <p>Алекс проверяет записи. CDL класса B, действует до следующего года. GVWR грузовика — 28 000 фунтов — класс B обязателен. Всё в порядке.</p>
        <blockquote>
          <strong>Алекс:</strong> «Да, CDL класс B действует, истекает в следующем марте. GVWR 28 000 фунтов, класс B покрывает тебя. Всё чисто.»
        </blockquote>
        <p>Это плановая проверка — но она показывает ценность точного ведения записей о водителях. Диспетчер, который не знает статус CDL своих водителей, работает вслепую.</p>

        <figure>
          <img src="https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?w=800" alt="Box truck как у Маркуса" loading="lazy" />
          <figcaption>Box truck как у Маркуса — знание GVWR и класса CDL для каждого автомобиля в парке защищает carrier от федеральных нарушений и провалов по сервису</figcaption>
        </figure>

        <h2>Итоги дня — что Алекс сделал правильно</h2>
        <ul>
          <li>Начал день с полного аудита оборудования — знал, что умеет каждый водитель, до появления первого груза</li>
          <li>Уточнил accessorials до принятия ставки по жилой/liftgate-доставке — получил дополнительные $100</li>
          <li>Поймал проблему с PPE до того, как водитель был отвергнут — решил её проактивно</li>
          <li>Распознал ловушку inside delivery в cargo van-грузе — включил сбор в ставку и зафиксировал в rate con</li>
          <li>Вёл точные записи о CDL — подтвердил мгновенно, когда Маркусу понадобилась верификация на весовом пункте</li>
        </ul>
        <p>Знание оборудования не просто предотвращает катастрофы — оно напрямую генерирует доход через уверенные переговоры по accessorials и профессиональное решение проблем.</p>
      `,
      quiz: {
        questions: [
          { id: 'eq-dm-q1', text: 'In the demo, why does Alex audit his drivers\' equipment profiles before opening the load board each morning?', options: ['It is a regulatory requirement from FMCSA', 'So he knows what each driver can handle before any load comes up — preventing last-minute equipment mismatches', 'To verify that drivers have not modified their trucks overnight', 'So he can report equipment status to the carrier\'s insurance company'], correctIndex: 1 },
          { id: 'eq-dm-q2', text: 'Alex sees a load posting: "26ft SB / LG / RESI." Which driver in his fleet should he assign?', options: ['Priya — her 16ft truck with ramps is fastest', 'Derek — his Cargo Van is most flexible for residential deliveries', 'Marcus — his 26ft truck with liftgate and CDL Class B is the only correct match', 'Any driver — residential deliveries have no equipment requirements'], correctIndex: 2 },
          { id: 'eq-dm-q3', text: 'The broker offers the residential liftgate load at $1,650. Alex counters to $1,800. What is his justification?', options: ['He always marks up 10% as standard dispatcher fee', 'The liftgate accessorial fee was not included in the $1,650 rate — he needs it accounted for', 'He wants to test the broker\'s flexibility before accepting any load', 'He believes the distance is longer than what the broker calculated'], correctIndex: 1 },
          { id: 'eq-dm-q4', text: 'Priya discovers a PPE requirement after being assigned to a petrochemical plant pickup. What is Alex\'s FIRST action?', options: ['Cancel the load immediately and blame the broker for not listing PPE', 'Call the broker, explain the situation, and request a window extension so Priya can obtain the required PPE', 'Tell Priya to enter the facility anyway — PPE rules are not strictly enforced', 'Assign the load to Derek — Cargo Vans are exempt from PPE requirements'], correctIndex: 1 },
          { id: 'eq-dm-q5', text: 'A broker offers a Cargo Van load — 3 pallets, $450, residential, inside delivery to the 2nd floor. Alex asks about inside delivery. Why does this matter?', options: ['Inside delivery is automatically included in all cargo van rates', 'Inside delivery requires a special insurance rider not available for Cargo Vans', 'Inside delivery is an extra service that requires an additional fee — it was not included in the $450 rate', 'Inside delivery changes the CDL requirements for the driver'], correctIndex: 2 },
          { id: 'eq-dm-q6', text: 'Alex tells Derek: "Do not go past the door if inside delivery is not on the rate con." Why is this instruction critical?', options: ['Without written confirmation, the carrier could be held liable for inside delivery labor without compensation', 'FMCSA prohibits inside delivery for Cargo Van drivers without a special permit', 'Drivers face CDL suspension if they perform inside delivery without documentation', 'The broker can cancel the load if the driver enters the building before unloading is complete'], correctIndex: 0 },
          { id: 'eq-dm-q7', text: 'Marcus calls from a DOT weigh station to confirm his CDL status. His truck has a GVWR of 28,000 lbs and he has CDL Class B. Is he compliant?', options: ['No — 28,000 lbs GVWR requires CDL Class A, not Class B', 'Yes — CDL Class B covers vehicles with GVWR over 26,001 lbs when not pulling a trailer over 10,001 lbs', 'No — DOT weigh stations require CDL Class A for all commercial vehicles', 'Yes — but only if the load weight is under 26,001 lbs regardless of GVWR'], correctIndex: 1 },
          { id: 'eq-dm-q8', text: 'Why is maintaining accurate, up-to-date CDL records for drivers a core dispatcher responsibility?', options: ['It is required for load board membership', 'CDL expiry or class mismatch can cause federal violations, insurance nullification, and service failures mid-load', 'Insurance companies require monthly CDL updates from dispatchers', 'It allows dispatchers to charge higher accessorial rates'], correctIndex: 1 },
          { id: 'eq-dm-q9', text: 'Priya\'s truck is a 16ft Box Truck with GVWR 22,000 lbs and no liftgate. Which of these loads is she UNABLE to accept?', options: ['6 pallets to a warehouse with a loading dock', '5 pallets of furniture to a residential address — no dock, liftgate required', '7 pallets to a commercial facility with a dock and forklift on site', '6 pallets to a distribution center with standard dock access'], correctIndex: 1 },
          { id: 'eq-dm-q10', text: 'In the demo, which single morning habit generates the most value for Alex throughout the day?', options: ['Checking load board rates before calling any broker', 'Auditing driver equipment profiles before any loads come up', 'Calling brokers on multiple loads simultaneously to find the highest rate', 'Confirming driver HOS hours before searching for loads'], correctIndex: 1 },
          { id: 'eq-dm-q11', text: 'Mini-case: A broker calls you with an urgent load — 8 pallets, Box Truck 26ft, pickup in 2 hours, $1,500. Your only available 26ft driver has CDL Class B but no liftgate. The load posting says "LG required." What do you do?', options: ['Accept — the driver will figure out liftgate alternatives on arrival', 'Decline or find a driver with liftgate — booking without required equipment causes a guaranteed service failure', 'Accept and charge the broker a "no liftgate surcharge" later', 'Accept and ask the consignee to bring their own forklift'], correctIndex: 1 },
          { id: 'eq-dm-q12', text: 'Mini-case: You have a Cargo Van load — medical supplies, 2 pallets, residential delivery, $380. Driver arrives and the consignee requests he bring the boxes to the 3rd floor (no elevator). The rate con says "curbside delivery only." What does the driver do?', options: ['Deliver to the 3rd floor — customer satisfaction is the priority', 'Call you immediately — this is beyond the scope of the rate con; you negotiate inside delivery pay before proceeding', 'Leave the freight at the curb and drive away without further discussion', 'Charge the customer a cash fee on the spot for the extra service'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-dm-q1', text: 'В демо-уроке — почему Алекс проверяет оборудование водителей ещё до открытия биржи грузов?', options: ['Это обязательное требование FMCSA', 'Чтобы знать, что умеет каждый водитель, прежде чем появится груз — и избежать несовпадений оборудования в последний момент', 'Чтобы убедиться, что водители не модифицировали грузовики ночью', 'Чтобы сообщить статус оборудования в страховую компанию перевозчика'], correctIndex: 1 },
          { id: 'eq-dm-q2', text: 'Алекс видит объявление: «26ft SB / LG / RESI». Какого водителя назначить?', options: ['Прию — её 16ft с пандусами самый быстрый', 'Дерека — Cargo Van наиболее гибкий для жилых доставок', 'Маркуса — его 26ft с лифтгейтом и CDL класса B единственное правильное совпадение', 'Любого — жилые доставки не имеют требований к оборудованию'], correctIndex: 2 },
          { id: 'eq-dm-q3', text: 'Брокер предлагает жилую liftgate-доставку за $1 650. Алекс просит $1 800. Его обоснование?', options: ['Он всегда добавляет 10% как стандартную комиссию диспетчера', 'Accessorial за лифтгейт не был включён в ставку $1 650 — он должен быть учтён', 'Он хочет проверить гибкость брокера перед принятием любого груза', 'Он считает, что расстояние длиннее, чем рассчитал брокер'], correctIndex: 1 },
          { id: 'eq-dm-q4', text: 'После назначения Прии на погрузку в нефтехимическом заводе обнаруживается требование PPE. Первое действие Алекса?', options: ['Немедленно отменить груз и обвинить брокера в отсутствии указания PPE', 'Позвонить брокеру, объяснить ситуацию и попросить расширить окно, пока Прия купит PPE', 'Сказать Прие заходить всё равно — требования PPE нестрого соблюдаются', 'Передать груз Дереку — Cargo Van освобождён от требований PPE'], correctIndex: 1 },
          { id: 'eq-dm-q5', text: 'Брокер предлагает груз для Cargo Van — 3 поддона, $450, жилой адрес, занос на 2-й этаж. Почему Алекс спрашивает про inside delivery?', options: ['Inside delivery автоматически включён во все ставки для cargo van', 'Inside delivery требует специального страхового дополнения, недоступного для Cargo Van', 'Inside delivery — дополнительная услуга с отдельным сбором, который не включён в $450', 'Inside delivery меняет требования к CDL для водителя'], correctIndex: 2 },
          { id: 'eq-dm-q6', text: 'Алекс говорит Дереку: «Не заходи внутрь, если inside delivery нет в rate con». Почему это важно?', options: ['Без письменного подтверждения перевозчик может выполнить занос без компенсации и без оснований для оплаты', 'FMCSA запрещает inside delivery для водителей Cargo Van без специального разрешения', 'Водителям грозит приостановка CDL за занос без документации', 'Брокер может отменить груз, если водитель войдёт в здание до окончания выгрузки'], correctIndex: 0 },
          { id: 'eq-dm-q7', text: 'Маркус звонит с весового пункта DOT. GVWR его грузовика 28 000 фунтов, у него CDL класса B. Соответствует ли он требованиям?', options: ['Нет — 28 000 фунтов GVWR требует CDL класса A, а не B', 'Да — CDL класс B покрывает транспортные средства с GVWR свыше 26 001 фунта без прицепа свыше 10 001 фунта', 'Нет — DOT весовые пункты требуют CDL класса A для всех коммерческих ТС', 'Да — но только если масса груза не превышает 26 001 фунта вне зависимости от GVWR'], correctIndex: 1 },
          { id: 'eq-dm-q8', text: 'Почему ведение точных актуальных записей о CDL водителей — ключевая обязанность диспетчера?', options: ['Это требуется для членства на бирже грузов', 'Истечение CDL или несоответствие категории могут вызвать федеральные нарушения, аннулирование страховки и срывы среди пути', 'Страховые компании требуют ежемесячных обновлений CDL от диспетчеров', 'Это позволяет диспетчерам устанавливать более высокие accessorial-ставки'], correctIndex: 1 },
          { id: 'eq-dm-q9', text: 'Грузовик Прии — Box Truck 16ft, GVWR 22 000 фунтов, без лифтгейта. Какой из этих грузов она НЕ может принять?', options: ['6 поддонов на склад с погрузочным доком', '5 поддонов мебели по жилому адресу — нет дока, лифтгейт обязателен', '7 поддонов в коммерческий объект с доком и погрузчиком', '6 поддонов в дистрибьюторский центр со стандартным доком'], correctIndex: 1 },
          { id: 'eq-dm-q10', text: 'Какая одна утренняя привычка приносит Алексу наибольшую ценность в течение дня?', options: ['Проверка ставок на бирже грузов до звонка любому брокеру', 'Аудит оборудования водителей до появления каких-либо грузов', 'Одновременные звонки нескольким брокерам для нахождения максимальной ставки', 'Проверка HOS водителей до поиска грузов'], correctIndex: 1 },
          { id: 'eq-dm-q11', text: 'Мини-кейс: Брокер звонит срочно — 8 поддонов, Box Truck 26ft, загрузка через 2 часа, $1 500. Единственный доступный 26ft-водитель имеет CDL класс B, но без лифтгейта. В объявлении «LG required». Ваши действия?', options: ['Принять — водитель разберётся с альтернативами на месте', 'Отказать или найти водителя с лифтгейтом — бронирование без нужного оборудования гарантированно ведёт к срыву', 'Принять и выставить брокеру "доплату за отсутствие лифтгейта" позже', 'Принять и попросить грузополучателя привезти свой погрузчик'], correctIndex: 1 },
          { id: 'eq-dm-q12', text: 'Мини-кейс: Груз для Cargo Van — медикаменты, 2 поддона, жилой адрес, $380. Водитель прибывает, грузополучатель просит занести коробки на 3-й этаж (лифта нет). В rate con написано "curbside delivery only". Действия водителя?', options: ['Занести на 3-й этаж — удовлетворённость клиента в приоритете', 'Немедленно позвонить вам — это выходит за рамки rate con; вы договариваетесь об оплате inside delivery до продолжения', 'Оставить груз у тротуара и уехать без дополнительного обсуждения', 'Взять наличные с клиента на месте за дополнительную услугу'], correctIndex: 1 },
        ],
      },
    },

    '3-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 3: Equipment Types</h2>
        <p>This practice test covers all material from Chapter 3: truck types and pallet capacities, CDL requirements and GVWR thresholds, equipment features (liftgate, pallet jack, ramps, bulkhead, PPE, load bars), accessorial charges, load board shorthand, and real dispatcher decision scenarios from the Demo lesson.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Truck types: Cargo Van (2–4 pallets), Box Truck 16ft (6–8 pallets), Box Truck 24ft/26ft (12–14 pallets)</li>
          <li>CDL Class B threshold: GVWR over 26,001 lbs</li>
          <li>Equipment features: LG, PJ, Ramps, Bulkhead, PPE, Load Bars</li>
          <li>Accessorial charges: liftgate, residential, inside delivery, detention</li>
          <li>Load board equipment shorthand: SB, CV, SPR, LG, PJ, RA, RESI, ID</li>
          <li>Equipment-based rate negotiation tactics</li>
          <li>Real dispatcher problem-solving: PPE failures, CDL verification, inside delivery documentation</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 3: Типы оборудования</h2>
        <p>Этот практический тест охватывает все материалы Главы 3: типы грузовиков и вместимость поддонов, требования к CDL и пороги GVWR, оснащение (лифтгейт, pallet jack, пандусы, перегородка, PPE, стяжные штанги), дополнительные сборы, сокращения биржи грузов и реальные сценарии принятия решений из урока «Демо».</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных и 5 мини-кейсов.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20) для прохождения практики по главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Типы грузовиков: Cargo Van (2–4 поддона), Box Truck 16ft (6–8 поддонов), Box Truck 24ft/26ft (12–14 поддонов)</li>
          <li>Порог CDL класса B: GVWR свыше 26 001 фунта</li>
          <li>Оснащение: LG, PJ, пандусы, Bulkhead, PPE, Load Bars</li>
          <li>Дополнительные сборы: liftgate, residential, inside delivery, detention</li>
          <li>Сокращения биржи грузов: SB, CV, SPR, LG, PJ, RA, RESI, ID</li>
          <li>Переговоры о ставке на основе оборудования</li>
          <li>Реальные задачи: сбои с PPE, проверка CDL, документирование inside delivery</li>
        </ul>
      `,
      quiz: {
        questions: [
          { id: 'eq-pr-q1', text: 'A Cargo Van / Sprinter Van can carry an average of how many standard pallets?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-pr-q2', text: 'What is the GVWR threshold that triggers a CDL Class B requirement for a straight truck driver?', options: ['Over 10,001 lbs', 'Over 18,001 lbs', 'Over 26,001 lbs', 'Over 33,001 lbs'], correctIndex: 2 },
          { id: 'eq-pr-q3', text: 'What does "LG" stand for in a load board posting?', options: ['Long Haul', 'Liftgate', 'Load Gate', 'Large Gauge'], correctIndex: 1 },
          { id: 'eq-pr-q4', text: 'A Box Truck 16ft carries how many standard pallets on average?', options: ['2–4', '6–8', '12–14', '16–18'], correctIndex: 1 },
          { id: 'eq-pr-q5', text: 'What is the primary purpose of a Pallet Jack (PJ) on a straight truck load?', options: ['Securing freight with a locking system during transit', 'Moving pallets manually when no forklift is available at the pickup or delivery location', 'Measuring pallet height to confirm trailer clearance', 'Connecting the truck body to the chassis frame'], correctIndex: 1 },
          { id: 'eq-pr-q6', text: 'Which accessorial charge is most likely to apply on a delivery to a private residence?', options: ['Hazmat handling fee', 'Residential Delivery fee', 'Overweight permit fee', 'Fuel surcharge only'], correctIndex: 1 },
          { id: 'eq-pr-q7', text: 'A load posting reads "26ft SB / LG / PJ / RESI." What does this tell you before calling the broker?', options: ['You need a 26ft box truck with liftgate and pallet jack, delivering to a residential address', 'You need a semi-truck with a 26ft box, long haul route, pallet jack for unloading', 'You need a 26ft van with a rear platform, pickup at a rail yard, ramps standard', 'You need a 26ft trailer, loading only, pallet jack provided by the shipper'], correctIndex: 0 },
          { id: 'eq-pr-q8', text: 'What is the standard accessorial fee range for a liftgate service per stop?', options: ['$10–$30', '$75–$150', '$200–$350', '$500+'], correctIndex: 1 },
          { id: 'eq-pr-q9', text: 'A Bulkhead in a straight truck serves what primary safety function?', options: ['It acts as a firewall protecting the engine compartment', 'It protects the driver from cargo shifting forward during hard braking', 'It seals the rear door from unauthorized access', 'It distributes weight evenly across the truck\'s axles'], correctIndex: 1 },
          { id: 'eq-pr-q10', text: 'When a driver is held at a facility beyond the free-time window (typically 1–2 hours), what charge applies?', options: ['Fuel surcharge at double rate', 'Detention pay — typically $50–$75 per hour beyond the free period', 'Residential surcharge for extended appointments', 'Inside delivery fee charged per extra hour'], correctIndex: 1 },
          { id: 'eq-pr-q11', text: 'Ramps are most appropriate at delivery locations that have:', options: ['A full loading dock with dock leveler', 'No dock and no liftgate, but freight can be wheeled or rolled off the truck', 'A forklift available but no dock plates', 'Standard palletized freight that requires hydraulic lift'], correctIndex: 1 },
          { id: 'eq-pr-q12', text: 'Why is confirming PPE requirements before a driver\'s pickup appointment a critical dispatcher responsibility?', options: ['PPE affects the truck\'s federal weight classification', 'Drivers turned away without PPE miss their appointment window, creating service failures and potential chargebacks', 'PPE verification is required for load board subscription compliance', 'PPE requirements only apply in California and New York'], correctIndex: 1 },
          { id: 'eq-pr-q13', text: 'A Box Truck 24ft has GVWR of 24,800 lbs. Does the driver need a CDL Class B?', options: ['Yes — all Box Trucks 24ft require CDL Class B regardless of GVWR', 'No — 24,800 lbs is under the 26,001 lb threshold; standard license is sufficient', 'Yes — any vehicle over 20,000 lbs requires CDL', 'No — CDL is only required if the truck is carrying hazardous materials'], correctIndex: 1 },
          { id: 'eq-pr-q14', text: 'Your driver has a Box Truck 26ft (GVWR 28,500 lbs) with liftgate. A broker offers a residential liftgate delivery at $1,700 — the liftgate fee is NOT included. What is your minimum counter-offer?', options: ['$1,700 — accept as posted; liftgate is standard equipment', '$1,775–$1,850 — add the liftgate accessorial ($75–$150) to the base rate', '$2,500 — residential deliveries always pay a premium above market', '$1,650 — offer a discount to build the broker relationship'], correctIndex: 1 },
          { id: 'eq-pr-q15', text: 'Load Bars (cargo bars) prevent what specific problem during freight transport?', options: ['Cargo overheating due to lack of ventilation', 'Freight shifting or sliding during transit, which can damage cargo and trigger DOT violations', 'Truck overloading beyond its GVWR', 'Liftgate hydraulic pressure loss during operation'], correctIndex: 1 },
          { id: 'eq-pr-q16', text: 'Mini-case: A broker posts a load — 8 pallets, Box Truck 16ft, warehouse delivery with dock, $950. Your 16ft driver has no CDL and no liftgate but has ramps. The posting has no LG requirement. Can you accept?', options: ['No — all Box Truck loads require liftgate by default', 'Yes — 8 pallets fits the 16ft capacity, dock delivery needs no liftgate, no CDL required under 26,001 lbs GVWR', 'No — 8 pallets exceed the 16ft Box Truck\'s 6-pallet maximum', 'Yes — but only if the driver gets a temporary CDL waiver first'], correctIndex: 1 },
          { id: 'eq-pr-q17', text: 'Mini-case: You have a Cargo Van driver available. A broker offers: 5 pallets of electronics, residential delivery, $550. What is the immediate problem?', options: ['$550 is too low for any residential delivery', 'A Cargo Van holds 2–4 pallets on average; 5 pallets exceeds its capacity — wrong equipment for this load', 'Electronics always require a refrigerated vehicle', 'Residential delivery is prohibited for Cargo Van drivers under FMCSA rules'], correctIndex: 1 },
          { id: 'eq-pr-q18', text: 'Mini-case: Your driver arrives at a pickup facility and is told: "You need steel-toed boots and a hard hat to enter." The rate con says nothing about PPE. Your driver has neither. What is the correct sequence of actions?', options: ['Driver enters the facility — PPE rules are rarely enforced', 'Driver waits in the truck; you call the broker immediately to request a time window extension, locate nearby safety supply, and get driver equipped before the appointment window closes', 'Cancel the load and find a different run — PPE issues are not worth solving', 'Driver borrows PPE from the shipper — most facilities have spare equipment for guests'], correctIndex: 1 },
          { id: 'eq-pr-q19', text: 'Mini-case: A broker offers an inside delivery load — 4 pallets, 2nd floor, no elevator, $480 flat. The load board shows "ID." How should you handle rate negotiation?', options: ['Accept $480 — ID loads always pay flat regardless of floor', 'Decline immediately — inside delivery to 2nd floor with no elevator is against carrier policy', 'Counter to $650–$700, explicitly requiring "inside delivery, 2nd floor, no elevator" written on the rate con', 'Accept $480 but tell the driver to only deliver to the first floor'], correctIndex: 2 },
          { id: 'eq-pr-q20', text: 'Mini-case: You have assigned a Box Truck 26ft driver (CDL Class B, GVWR 27,200 lbs) to a load. En route, the driver is pulled over at a DOT checkpoint and the officer asks for CDL documentation. The CDL expired 3 weeks ago. What is the immediate consequence and dispatcher lesson?', options: ['No consequence — a 3-week grace period exists for CDL renewal', 'Driver is placed out of service; load cannot continue; carrier faces federal violation. Dispatcher lesson: verify CDL expiration dates proactively — never dispatch without confirming current license status', 'Driver receives a warning only — first offense for expired CDL is non-actionable', 'Driver can continue if the carrier\'s insurance covers the gap period'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-pr-q1', text: 'Сколько стандартных поддонов в среднем вмещает Cargo Van / Sprinter Van?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-pr-q2', text: 'При каком значении GVWR требуется минимум CDL класса B для водителя прямого грузовика?', options: ['Свыше 10 001 фунта', 'Свыше 18 001 фунта', 'Свыше 26 001 фунта', 'Свыше 33 001 фунта'], correctIndex: 2 },
          { id: 'eq-pr-q3', text: 'Что означает "LG" в объявлении на бирже грузов?', options: ['Long Haul (дальний рейс)', 'Liftgate (лифтгейт)', 'Load Gate (грузовые ворота)', 'Large Gauge (крупный калибр)'], correctIndex: 1 },
          { id: 'eq-pr-q4', text: 'Сколько стандартных поддонов в среднем вмещает Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '16–18'], correctIndex: 1 },
          { id: 'eq-pr-q5', text: 'Каково основное назначение Pallet Jack (PJ) при работе с прямым грузовиком?', options: ['Фиксация груза замковой системой в пути', 'Ручное перемещение поддонов при отсутствии погрузчика в точке погрузки/выгрузки', 'Измерение высоты поддона для контроля просвета кузова', 'Соединение кузова с рамой шасси грузовика'], correctIndex: 1 },
          { id: 'eq-pr-q6', text: 'Какой дополнительный сбор с наибольшей вероятностью применяется при доставке по частному жилому адресу?', options: ['Сбор за обращение с опасными грузами', 'Сбор за доставку в жилую зону (Residential Delivery)', 'Сбор за разрешение на перегруз', 'Только надбавка за топливо'], correctIndex: 1 },
          { id: 'eq-pr-q7', text: 'Объявление гласит: «26ft SB / LG / PJ / RESI». Что это означает до звонка брокеру?', options: ['Нужен Box Truck 26ft с лифтгейтом и pallet jack, доставка по жилому адресу', 'Нужен полуприцеп 26ft, дальний маршрут, PJ предоставляет перевозчик', 'Нужен фургон 26ft с задней платформой, погрузка на ж/д терминале, пандусы стандартные', 'Нужен прицеп 26ft, только погрузка, PJ обеспечивает грузоотправитель'], correctIndex: 0 },
          { id: 'eq-pr-q8', text: 'Каков стандартный диапазон accessorial-сбора за лифтгейт на одну остановку?', options: ['$10–$30', '$75–$150', '$200–$350', '$500+'], correctIndex: 1 },
          { id: 'eq-pr-q9', text: 'Какую основную функцию безопасности выполняет Bulkhead в прямом грузовике?', options: ['Служит противопожарной перегородкой, защищая двигательный отсек', 'Защищает водителя от смещения груза вперёд при резком торможении', 'Защищает заднюю дверь от несанкционированного доступа', 'Равномерно распределяет вес по осям грузовика'], correctIndex: 1 },
          { id: 'eq-pr-q10', text: 'Когда водителя задерживают на объекте дольше бесплатного периода (обычно 1–2 часа), какой сбор применяется?', options: ['Двойная надбавка за топливо', 'Оплата простоя (detention) — обычно $50–$75 в час сверх бесплатного периода', 'Жилой сбор за длительные приёмы', 'Плата за inside delivery за каждый дополнительный час'], correctIndex: 1 },
          { id: 'eq-pr-q11', text: 'Пандусы наиболее уместны в точках доставки, где:', options: ['Есть полный погрузочный дoк с выравнивателем', 'Нет дока и лифтгейта, но груз можно выкатить или вывезти', 'Есть погрузчик, но нет перекладных плит', 'Поддонный груз требует гидравлического подъёма'], correctIndex: 1 },
          { id: 'eq-pr-q12', text: 'Почему уточнение требований к PPE до окна погрузки водителя — критическая ответственность диспетчера?', options: ['PPE влияет на федеральную весовую классификацию грузовика', 'Водители без PPE не допускаются на объект, пропускают окно доставки — срыв и возможный штраф', 'Верификация PPE обязательна для соответствия требованиям биржи грузов', 'Требования PPE действуют только в Калифорнии и Нью-Йорке'], correctIndex: 1 },
          { id: 'eq-pr-q13', text: 'Box Truck 24ft имеет GVWR 24 800 фунтов. Требуется ли водителю CDL класса B?', options: ['Да — все Box Truck 24ft требуют CDL класса B вне зависимости от GVWR', 'Нет — 24 800 фунтов ниже порога 26 001 фунта; достаточно обычных прав', 'Да — любое ТС свыше 20 000 фунтов требует CDL', 'Нет — CDL требуется только при перевозке опасных грузов'], correctIndex: 1 },
          { id: 'eq-pr-q14', text: 'Ваш водитель: Box Truck 26ft (GVWR 28 500 фунтов) с лифтгейтом. Брокер предлагает жилую доставку с лифтгейтом за $1 700 — liftgate fee не включён. Какое минимальное встречное предложение?', options: ['$1 700 — принять как опубликовано; лифтгейт стандартное оборудование', '$1 775–$1 850 — добавить accessorial за лифтгейт ($75–$150) к базовой ставке', '$2 500 — жилые доставки всегда платят выше рынка', '$1 650 — предложить скидку для развития отношений с брокером'], correctIndex: 1 },
          { id: 'eq-pr-q15', text: 'Стяжные штанги (Load Bars) предотвращают какую конкретную проблему при транспортировке?', options: ['Перегрев груза из-за отсутствия вентиляции', 'Смещение или скольжение груза в пути — повреждение товара и нарушения при проверке DOT', 'Перегруз грузовика сверх GVWR', 'Потерю гидравлического давления лифтгейта во время работы'], correctIndex: 1 },
          { id: 'eq-pr-q16', text: 'Мини-кейс: Брокер предлагает 8 поддонов, Box Truck 16ft, доставка на склад с доком, $950. Ваш водитель на 16ft без CDL и без лифтгейта, но с пандусами. В объявлении нет требования LG. Можно принять?', options: ['Нет — все грузы на Box Truck требуют лифтгейта по умолчанию', 'Да — 8 поддонов вмещается в 16ft, доставка на dock без лифтгейта, CDL не нужен при GVWR ниже 26 001 фунта', 'Нет — 8 поддонов превышают максимум 16ft в 6 поддонов', 'Да — но только после получения водителем временного разрешения CDL'], correctIndex: 1 },
          { id: 'eq-pr-q17', text: 'Мини-кейс: Водитель Cargo Van доступен. Брокер предлагает: 5 поддонов электроники, жилой адрес, $550. В чём немедленная проблема?', options: ['$550 слишком мало для любой жилой доставки', 'Cargo Van вмещает 2–4 поддона в среднем; 5 поддонов превышает вместимость — неверное оборудование для груза', 'Электроника всегда требует рефрижераторного транспорта', 'Жилые доставки запрещены для водителей Cargo Van по правилам FMCSA'], correctIndex: 1 },
          { id: 'eq-pr-q18', text: 'Мини-кейс: Водитель приезжает на погрузку и ему говорят: «Нужны ботинки со стальным носком и каска». В rate con ничего про PPE нет. У водителя ничего нет. Правильная последовательность действий?', options: ['Водитель входит — требования PPE редко соблюдаются строго', 'Водитель ждёт в кабине; вы немедленно звоните брокеру для продления окна, ищете ближайший магазин защиты и снаряжаете водителя до закрытия окна', 'Отменить груз — проблемы с PPE не стоят решения', 'Водитель занимает PPE у грузоотправителя — у большинства объектов есть запасное снаряжение'], correctIndex: 1 },
          { id: 'eq-pr-q19', text: 'Мини-кейс: Брокер предлагает inside delivery — 4 поддона, 2-й этаж, лифта нет, $480 фикс. В объявлении указано "ID". Как вести переговоры о ставке?', options: ['Принять $480 — ID-грузы всегда фиксированная ставка вне зависимости от этажа', 'Отказать немедленно — inside delivery на 2-й этаж без лифта против политики перевозчика', 'Встречное предложение $650–$700, явно потребовав в rate con "inside delivery, 2nd floor, no elevator"', 'Принять $480, но сказать водителю доставлять только на первый этаж'], correctIndex: 2 },
          { id: 'eq-pr-q20', text: 'Мини-кейс: Водитель Box Truck 26ft (CDL класс B, GVWR 27 200 фунтов) — в пути. Его останавливает DOT. CDL истёк 3 недели назад. Немедленные последствия и урок для диспетчера?', options: ['Никаких последствий — существует 3-недельный льготный период для продления CDL', 'Водитель снят с рейса; груз не может продолжить движение; перевозчик получает федеральное нарушение. Урок: проверяйте дату истечения CDL проактивно — никогда не отправляйте без подтверждения актуальности прав', 'Водитель получает только предупреждение — первое нарушение за просроченный CDL не влечёт санкций', 'Водитель может продолжить, если страховая перевозчика покрывает период истечения CDL'], correctIndex: 1 },
        ],
      },
    },
  };

  return contents[`${chapter}-${lesson}`] ?? { type: 'text', body: `Content for chapter ${chapter}, lesson ${lesson} — coming soon.`, bodyRu: `Контент главы ${chapter}, урок ${lesson} — скоро будет.` };
}

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.dev' },
    update: {},
    create: {
      email: 'admin@lms.dev',
      passwordHash: await hash('Admin123!'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@lms.dev' },
    update: {},
    create: {
      email: 'manager@lms.dev',
      passwordHash: await hash('Manager123!'),
      firstName: 'Anna',
      lastName: 'Manager',
      role: UserRole.MANAGER,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@lms.dev' },
    update: {},
    create: {
      email: 'student@lms.dev',
      passwordHash: await hash('Student123!'),
      firstName: 'Ivan',
      lastName: 'Novikov',
      role: UserRole.STUDENT,
      managerId: manager.id,
    },
  });

  // Reset all progress for test student (clean slate for proper chapter progression)
  await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
  await prisma.chapterProgress.deleteMany({ where: { userId: student.id } });

  // Course
  const course = await prisma.course.upsert({
    where: { id: 'course-dispatchers-v1' },
    update: {},
    create: {
      id: 'course-dispatchers-v1',
      title: 'Dispatcher Training — US Trucking',
      description: 'From zero to first deal in 21 days.',
      status: ContentStatus.PUBLISHED,
    },
  });

  const chapterTitles = [
    'Introduction to US Trucking',
    'Geography & Time Zones',
    'Equipment Types',
    'Documentation (Rate Con, BOL, POD)',
    'Load Board Platform',
    'Communication with Brokers',
    'Communication with Drivers',
    'Bidding & Deal Closing',
    'Recovery & Problem Solving',
  ];

  for (let i = 0; i < chapterTitles.length; i++) {
    const chapter = await prisma.chapter.upsert({
      where: { id: `chapter-${i + 1}` },
      update: {},
      create: {
        id: `chapter-${i + 1}`,
        courseId: course.id,
        title: chapterTitles[i],
        order: i + 1,
        status: i === 0 ? ContentStatus.PUBLISHED : ContentStatus.PUBLISHED,
        passThreshold: 80,
      },
    });

    const lessonTypes: LessonType[] = [
      LessonType.INTRO,
      LessonType.THEORY,
      LessonType.DEMO,
      LessonType.PRACTICE,
    ];

    // Unlock only first chapter for test student
    if (i === 0) {
      await prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId: student.id, chapterId: chapter.id } },
        update: { status: ProgressStatus.IN_PROGRESS },
        create: { userId: student.id, chapterId: chapter.id, status: ProgressStatus.IN_PROGRESS },
      });
    }

    for (let j = 0; j < lessonTypes.length; j++) {
      const lesson = await prisma.lesson.upsert({
        where: { id: `lesson-${i + 1}-${j + 1}` },
        update: { content: getContent(i + 1, j + 1) },
        create: {
          id: `lesson-${i + 1}-${j + 1}`,
          chapterId: chapter.id,
          type: lessonTypes[j],
          title: `${lessonTypes[j].charAt(0) + lessonTypes[j].slice(1).toLowerCase()} — ${chapterTitles[i]}`,
          order: j + 1,
          status: ContentStatus.PUBLISHED,
          content: getContent(i + 1, j + 1),
        },
      });

      // Unlock only first lesson of first chapter for test student
      if (i === 0 && j === 0) {
        await prisma.lessonProgress.upsert({
          where: { userId_lessonId: { userId: student.id, lessonId: lesson.id } },
          update: {},
          create: { userId: student.id, lessonId: lesson.id, status: ProgressStatus.IN_PROGRESS },
        });
      }
    }

    // Sample question
    const q = await prisma.question.create({
      data: {
        chapterId: chapter.id,
        text: `Sample question for chapter ${i + 1}?`,
        explanation: 'This is the explanation.',
        order: 1,
      },
    });
    await prisma.questionOption.createMany({
      data: [
        { questionId: q.id, text: 'Correct answer', isCorrect: true, order: 1 },
        { questionId: q.id, text: 'Wrong answer A', isCorrect: false, order: 2 },
        { questionId: q.id, text: 'Wrong answer B', isCorrect: false, order: 3 },
        { questionId: q.id, text: 'Wrong answer C', isCorrect: false, order: 4 },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
