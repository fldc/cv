## Experience

- ##### October 2025 – Present

  ### Elivra AB (Linköping, Sweden)

  #### System developer
  - Python development for backend services.
  - C development for telecommunications systems.
  - DevOps tasks including CI/CD pipeline management and cloud infrastructure.
  - Collaborating with cross-functional teams to design and implement scalable solutions.
  - AI and machine learning model integration.

  > _Python_ _C_ _Docker_ _CI/CD_ _Telecommunications_ _Cloud_

- ##### 2016 – 2017

  ### Lecora AB (Vadstena, Sweden)

  #### Food production worker

  **Lecora AB** is a company in Vadstena, Sweden that produces and packages food products.
  - Assembling, preparing, and packaging ready-made food products for retail and catering markets.

- ##### November 2012 – Oktober 2015

  ### Tronity Inc. (Remote)

  #### Android developer

  **Tronity Inc.** was a company based in Seattle, WA, specializing in Android development consulting.
  - Developed custom firmware for **Android** devices.
  - Developed **Android** applications in Java.

  > _Java_ _Android_ _Gradle_ _Git_

- ##### May 2005 – July 2009

  ### Dometic (Motala, Sweden)

  #### Technician

  **Dometic** was a company based in Sweden, specializing in **refrigeration systems** for the **marine** and **automotive** industries.
  - Assembled and tested **refrigeration systems**.

- ##### 1998 - 2000

  ### Wasadata Systems AB (Vadstena, Sweden)

  #### System development and administration

  **Wasadata Systems AB** was a company based in Sweden, specializing in **telecommunication systems** and IT consulting.

  > _Linux_ _Apache_ _MySQL_ _PHP_ _Bash_ _Python_ _DNS_ _Postfix_ _Firewalls_ _Networking_ _Security_

- ##### October 24th, 1982

  ### Born

<style lang="scss">
  @use 'sass:color';
  @use '../styles/theme.scss';

  #experience .markdown-body > ul {
    position: relative;

    &::before {
      background-color: color.adjust(theme.$background-color, $lightness: 5%);
      bottom: 0;
      content: ' ';
      left: 20%;
      margin-left: -1px;
      position: absolute;
      top: 0;
      width: 2px;
    }

    > li {
      margin: 0 0 0 20%;
      max-width: 66em;
      padding-left: 2em;
      position: relative;
      width: 80%;

      + li {
        margin-top: 3em;
      }

      > h3 {
        line-height: 1.1;
      }

      > h5 {
        background: color.adjust(theme.$heading-color, $lightness: -2%);
        border-radius: 18px;
        padding: 2px 14px;
        position: absolute;
        right: 104%;
        text-shadow: 0 1px color.adjust(theme.$heading-color, $lightness: -30%);
        white-space: nowrap;
      }

      &::before {
        left: 0;
        margin: 0;
        position: absolute;
        transform: translateX(-50%);
      }
    }

    @media screen and (max-width: 1022px) {
      &::before {
        left: -1.2em;
      }

      > li {
        margin-left: 0;
        max-width: 100%;
        padding-left: 0.5em;
        width: 100%;

        > h5 {
          display: inline-block;
          margin-bottom: 1.2em;
          position: static;
          right: auto;
        }

        &::before {
          transform: translateX(-1.5em);
        }
      }
    }
  }
</style>
